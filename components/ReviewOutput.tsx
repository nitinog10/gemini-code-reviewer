import React, { useState } from 'react';
import type { Review, Issue, Suggestion } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ReviewOutputProps {
  review: Review | null;
}

const severityColorMap: { [key: string]: string } = {
  Critical: 'bg-red-light/20 text-red-light border-red-light/50',
  High: 'bg-yellow-light/20 text-yellow-light border-yellow-light/50',
  Medium: 'bg-blue-light/20 text-blue-light border-blue-light/50',
  Low: 'bg-gray-600/20 text-gray-400 border-gray-600/50',
};

const categoryColorMap: { [key: string]: string } = {
  Performance: 'bg-green-light/20 text-green-light border-green-light/50',
  Readability: 'bg-cyan-light/20 text-cyan-light border-cyan-light/50',
  'Best Practice': 'bg-blue-light/20 text-blue-light border-blue-light/50',
  Security: 'bg-red-light/20 text-red-light border-red-light/50'
};

const Tag: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${className}`}>
        {text}
    </span>
);

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:bg-gray-600 hover:text-white transition-colors">
            {copied ? <CheckIcon className="w-5 h-5 text-green-light" /> : <ClipboardIcon className="w-5 h-5" />}
        </button>
    );
};

export const ReviewOutput: React.FC<ReviewOutputProps> = ({ review }) => {
  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <SparklesIcon className="w-16 h-16 mb-4 text-gray-700" />
        <h3 className="text-lg font-medium">Ready for your code</h3>
        <p className="max-w-xs">Paste your code on the left, select the language, and click "Review Code" to get started.</p>
      </div>
    );
  }

  const { summary, issues, suggestions } = review;
  
  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      <div className="bg-gray-900/50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg text-blue-light mb-2">Overall Summary</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-red-light mb-3">Issues & Vulnerabilities</h3>
        {issues.length > 0 ? (
          <div className="space-y-4">
            {issues.map((issue: Issue, index: number) => (
              <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-200">{issue.description}</p>
                    <Tag text={issue.severity} className={severityColorMap[issue.severity] || severityColorMap.Low} />
                </div>
                {issue.suggestion && (
                  <div className="mt-3 bg-gray-800 p-3 rounded-md font-mono text-sm relative">
                    <p className="text-yellow-light mb-1">Suggestion:</p>
                    <pre className="whitespace-pre-wrap text-gray-300"><code>{issue.suggestion}</code></pre>
                    <CopyButton textToCopy={issue.suggestion} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No critical issues or vulnerabilities found. Great job!</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-lg text-green-light mb-3">Improvements & Best Practices</h3>
        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((sugg: Suggestion, index: number) => (
              <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                 <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-200">{sugg.description}</p>
                    <Tag text={sugg.category} className={categoryColorMap[sugg.category] || 'bg-gray-600'} />
                </div>
                {sugg.suggestion && (
                  <div className="mt-3 bg-gray-800 p-3 rounded-md font-mono text-sm relative">
                    <p className="text-yellow-light mb-1">Suggestion:</p>
                    <pre className="whitespace-pre-wrap text-gray-300"><code>{sugg.suggestion}</code></pre>
                    <CopyButton textToCopy={sugg.suggestion} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No specific improvement suggestions. The code looks solid.</p>
        )}
      </div>
    </div>
  );
};