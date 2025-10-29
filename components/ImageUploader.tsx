import React, { useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onClear: () => void;
  hasImage: boolean;
  previewUrl: string | undefined;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onClear, hasImage, previewUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  if (hasImage && previewUrl) {
    return (
        <div className="relative aspect-square rounded-xl border border-base-300 overflow-hidden bg-base-200/50">
            <img src={previewUrl} alt="Uploaded preview" className="w-full h-full object-contain" />
            <button
                onClick={onClear}
                className="absolute top-3 right-3 p-2 bg-slate-900/60 text-slate-200 rounded-full hover:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-all"
                aria-label="Clear uploaded image"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    );
  }

  return (
    <div className="p-4 bg-base-200 rounded-xl border border-base-300">
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative block w-full aspect-square rounded-lg border-2 border-dashed border-base-300 hover:border-brand-primary transition-colors cursor-pointer"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <UploadIcon className="h-12 w-12 text-slate-400 mb-4" />
          <p className="font-semibold text-slate-300">Drag & drop an image here</p>
          <p className="text-sm text-slate-400 mt-1">or <button onClick={handleBrowseClick} className="text-brand-primary font-medium hover:underline bg-transparent border-none p-0">browse files</button></p>
        </div>
        <input
          ref={inputRef}
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};