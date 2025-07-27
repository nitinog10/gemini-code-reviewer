
import React from 'react';

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: string;
}

export const CodeInput: React.FC<CodeInputProps> = ({ code, onCodeChange, language }) => {
  return (
    <textarea
      value={code}
      onChange={(e) => onCodeChange(e.target.value)}
      placeholder={`// Paste your ${language} code here...`}
      className="w-full h-full flex-grow p-4 bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none rounded-lg"
      spellCheck="false"
      autoCapitalize="off"
      autoCorrect="off"
    />
  );
};
