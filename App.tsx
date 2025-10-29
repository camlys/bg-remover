import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ActionPanel } from './components/ActionPanel';
import { ImageViewer } from './components/ImageViewer';
import { Footer } from './components/Footer';
import { fileToBase64 } from './utils/fileUtils';
import { removeBackground, editImageWithPrompt, addBackgroundColor } from './services/geminiService';

interface ImageObject {
  file: File;
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export default function App() {
  const [originalImage, setOriginalImage] = useState<ImageObject | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [backgroundColor, setBackgroundColor] = useState<string>('transparent');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setError(null);
    setProcessedImage(null);
    setPrompt('');
    try {
      const { base64, mimeType } = await fileToBase64(file);
      setOriginalImage({
        file,
        base64,
        mimeType,
        previewUrl: URL.createObjectURL(file),
      });
    } catch (err) {
      setError('Could not process the uploaded file. Please try another image.');
      setOriginalImage(null);
    }
  }, []);

  const clearImage = useCallback(() => {
    if (originalImage) {
      URL.revokeObjectURL(originalImage.previewUrl);
    }
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setPrompt('');
  }, [originalImage]);

  const handleProcessImage = useCallback(async (
    processingFunction: (base64: string, mimeType: string) => Promise<string>
  ) => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      const resultBase64 = await processingFunction(originalImage.base64, originalImage.mimeType);
      const mimeType = resultBase64.startsWith('iVBORw0KGgo') ? 'image/png' : 'image/jpeg';
      setProcessedImage(`data:${mimeType};base64,${resultBase64}`);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during image processing.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const handleRemoveBackground = useCallback(() => {
     handleProcessImage(removeBackground);
  }, [handleProcessImage]);

  const handleEditImage = useCallback(() => {
    if (!prompt.trim()) {
        setError("Please enter an editing instruction.");
        return;
    }
    handleProcessImage((base64, mimeType) => editImageWithPrompt(base64, mimeType, prompt));
  }, [prompt, handleProcessImage]);

  const handleAddBackgroundColor = useCallback(() => {
    if (backgroundColor === 'transparent') {
        handleRemoveBackground();
        return;
    }
    handleProcessImage((base64, mimeType) => addBackgroundColor(base64, mimeType, backgroundColor));
  }, [backgroundColor, handleProcessImage, handleRemoveBackground]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {!originalImage ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-md">
              <ImageUploader
                onImageUpload={handleImageUpload}
                onClear={clearImage}
                hasImage={false}
                previewUrl={undefined}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Panel: Source Image and Controls */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-3 text-slate-300 tracking-wide">Source Image</h2>
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  onClear={clearImage}
                  hasImage={!!originalImage}
                  previewUrl={originalImage?.previewUrl}
                />
              </div>
              <ActionPanel
                prompt={prompt}
                onPromptChange={setPrompt}
                onRemoveBg={handleRemoveBackground}
                onEdit={handleEditImage}
                onDownload={() => {
                  if (processedImage) {
                    const link = document.createElement('a');
                    link.href = processedImage;
                    link.download = `edited-${originalImage.file.name.split('.').slice(0, -1).join('.')}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
                isLoading={isLoading}
                hasProcessedImage={!!processedImage}
                backgroundColor={backgroundColor}
                onBackgroundColorChange={setBackgroundColor}
                onAddBackgroundColor={handleAddBackgroundColor}
              />
            </div>
            
            {/* Right Panel: Result */}
            <ImageViewer
              processedImageUrl={processedImage}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}