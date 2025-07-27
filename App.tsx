
import React, { useState, useCallback } from 'react';
import { CodeInput } from './components/CodeInput';
import { LanguageSelector } from './components/LanguageSelector';
import { ReviewOutput } from './components/ReviewOutput';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { reviewCode } from './services/geminiService';
import { LANGUAGES } from './constants';
import type { Review } from './types';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>(LANGUAGES[0].value);
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReview(null);

    try {
      const result = await reviewCode(code, language);
      setReview(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get review. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          {/* Left Panel */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-blue-light">Your Code</h2>
              <LanguageSelector
                language={language}
                onLanguageChange={setLanguage}
              />
            </div>
            <div className="flex-grow flex flex-col bg-gray-800 rounded-lg shadow-lg">
              <CodeInput code={code} onCodeChange={setCode} language={language}/>
            </div>
            <button
              onClick={handleReview}
              disabled={isLoading || !code.trim()}
              className="flex items-center justify-center gap-2 w-full bg-blue-light text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-cyan-light transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500"
            >
              {isLoading ? (
                <>
                  <Loader small={true} />
                  <span>Reviewing...</span>
                </>
              ) : (
                <>
                  <SparklesIcon />
                  <span>Review Code</span>
                </>
              )}
            </button>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col gap-4">
             <h2 className="text-xl font-semibold text-green-light">Gemini's Feedback</h2>
             <div className="flex-grow bg-gray-800 rounded-lg shadow-lg p-6 relative min-h-[400px] lg:min-h-0">
                {isLoading && <Loader />}
                {error && <div className="text-red-light bg-red-light/10 p-4 rounded-md">{error}</div>}
                {!isLoading && !error && <ReviewOutput review={review} />}
             </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-600 text-sm">
        <p>Powered by Google Gemini. Built for brilliant code.</p>
      </footer>
    </div>
  );
};

export default App;
