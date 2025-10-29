import React from 'react';
import { Loader } from './Loader';

interface ImageViewerProps {
  processedImageUrl: string | null;
  isLoading: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ processedImageUrl, isLoading }) => {
  const renderContent = () => {
    if (isLoading) {
      return <Loader size="lg" />;
    }
    if (processedImageUrl) {
      return <img src={processedImageUrl} alt="Processed result" className="w-full h-full object-contain" />;
    }
    return (
      <div className="text-center text-slate-400 p-4">
        <p className="font-semibold">Your edited image will appear here</p>
        <p className="text-sm mt-1">Use the controls on the left to get started.</p>
      </div>
    );
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-slate-300 tracking-wide">Result</h2>
      <div className="aspect-square w-full bg-base-200 rounded-xl border border-base-300 flex items-center justify-center overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};