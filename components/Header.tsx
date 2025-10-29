import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 border-b border-base-300 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-7 w-7 text-brand-primary" />
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              AI Image Editor
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};