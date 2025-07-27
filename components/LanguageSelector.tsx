
import React from 'react';
import { LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="appearance-none bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-light focus:border-blue-light block w-full pl-3 pr-10 py-2.5"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
};
