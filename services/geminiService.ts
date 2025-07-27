
import { GoogleGenAI, Type } from "@google/genai";
import type { Review } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const reviewSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: 'A brief, overall summary of the code quality in 2-3 sentences.',
        },
        issues: {
            type: Type.ARRAY,
            description: 'A list of critical bugs, potential errors, or security vulnerabilities.',
            items: {
                type: Type.OBJECT,
                properties: {
                    severity: {
                        type: Type.STRING,
                        description: 'Severity of the issue. Must be one of: "Critical", "High", "Medium", "Low".',
                    },
                    description: {
                        type: Type.STRING,
                        description: 'A detailed explanation of the issue.',
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: 'A concrete suggestion or code snippet to fix the issue.',
                    },
                },
                required: ['severity', 'description', 'suggestion'],
            },
        },
        suggestions: {
            type: Type.ARRAY,
            description: 'A list of suggestions for performance improvements, best practices, and readability.',
            items: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        description: 'Category of the suggestion. Must be one of: "Performance", "Readability", "Best Practice", "Security".',
                    },
                    description: {
                        type: Type.STRING,
                        description: 'A detailed explanation of the suggestion.',
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: 'A concrete suggestion or code snippet for improvement.',
                    },
                },
                required: ['category', 'description', 'suggestion'],
            },
        },
    },
    required: ['summary', 'issues', 'suggestions'],
};

export async function reviewCode(code: string, language: string): Promise<Review> {
    const prompt = `
    You are an expert code reviewer acting as a senior software engineer.
    Your task is to provide a comprehensive, professional, and helpful code review.
    Analyze the following ${language} code carefully.

    Provide a detailed review focusing on the following aspects:
    1.  **Bugs and Potential Errors:** Identify any logical errors, off-by-one errors, null pointer exceptions, or other potential runtime issues.
    2.  **Security Vulnerabilities:** Look for common security flaws like injection attacks, XSS, insecure data handling, etc.
    3.  **Performance:** Suggest ways to make the code faster or more memory-efficient.
    4.  **Best Practices & Readability:** Comment on code style, naming conventions, clarity, and adherence to language-specific best practices. Suggest better ways to structure the code.
    5.  **Maintainability:** Assess how easy the code is to understand, modify, and extend.

    Format your response strictly according to the provided JSON schema.
    Ensure every issue and suggestion is actionable and clearly explained.
    If there are no issues or suggestions in a category, return an empty array for it.

    Code to review:
    \`\`\`${language}
    ${code}
    \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: reviewSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedReview = JSON.parse(jsonText);
        
        // Basic validation to ensure the parsed object matches the expected structure
        if (!parsedReview.summary || !Array.isArray(parsedReview.issues) || !Array.isArray(parsedReview.suggestions)) {
            throw new Error("Received malformed JSON response from API.");
        }

        return parsedReview as Review;

    } catch (error) {
        console.error("Error during Gemini API call:", error);
        if (error instanceof Error) {
            throw new Error(`API Error: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while communicating with the API.");
    }
}
