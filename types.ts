
export interface Issue {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  suggestion: string;
}

export interface Suggestion {
  category: 'Performance' | 'Readability' | 'Best Practice' | 'Security';
  description: string;
  suggestion: string;
}

export interface Review {
  summary: string;
  issues: Issue[];
  suggestions: Suggestion[];
}
