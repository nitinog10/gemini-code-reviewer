
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="p-4 border-b border-gray-700">
      <div className="container mx-auto flex items-center gap-3">
        <img src="https://www.gstatic.com/lamda/images/gemini_logo_g_234710214.svg" alt="Gemini Logo" className="h-8 w-8" />
        <h1 className="text-2xl font-bold text-white">
          Gemini Code Reviewer
        </h1>
      </div>
    </header>
  );
};
