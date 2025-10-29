import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { PaintBrushIcon } from './icons/PaintBrushIcon';
import { Loader } from './Loader';

interface ActionPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onRemoveBg: () => void;
  onEdit: () => void;
  onDownload: () => void;
  isLoading: boolean;
  hasProcessedImage: boolean;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  onAddBackgroundColor: () => void;
}

const PRESET_COLORS = ['transparent', '#ffffff', '#0f172a', '#e2e8f0', '#ef4444', '#3b82f6', '#22c55e', '#f97316', '#8b5cf6'];


export const ActionPanel: React.FC<ActionPanelProps> = ({
  prompt,
  onPromptChange,
  onRemoveBg,
  onEdit,
  onDownload,
  isLoading,
  hasProcessedImage,
  backgroundColor,
  onBackgroundColorChange,
  onAddBackgroundColor,
}) => {
  return (
    <div className="p-4 bg-base-200 rounded-xl border border-base-300 space-y-4">
      {/* Background Color Section */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Background Color
        </label>
        <div className="flex items-center gap-2">
            <div className="relative">
                <input
                    type="color"
                    value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                    onChange={(e) => onBackgroundColorChange(e.target.value)}
                    className="w-8 h-8 p-0 border-0 rounded-md cursor-pointer appearance-none bg-transparent focus:ring-0 focus:outline-none"
                    style={{'--color': backgroundColor} as React.CSSProperties}
                    disabled={isLoading}
                    aria-label="Select a custom background color"
                />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => {
                  if (color === 'transparent') {
                    return (
                       <button
                        key={color}
                        type="button"
                        className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${backgroundColor === color ? 'border-brand-primary' : 'border-base-300'}`}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%2364748b' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E")` }}
                        onClick={() => onBackgroundColorChange(color)}
                        disabled={isLoading}
                        aria-label="Set background to transparent"
                      />
                    )
                  }
                  return (
                    <button
                        key={color}
                        type="button"
                        className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${backgroundColor.toLowerCase() === color ? 'border-brand-primary' : 'border-base-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => onBackgroundColorChange(color)}
                        disabled={isLoading}
                        aria-label={`Set background color to ${color}`}
                    />
                )})}
            </div>
        </div>
      </div>
       <button
          onClick={onAddBackgroundColor}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-indigo-400 disabled:bg-base-300 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <Loader /> : <PaintBrushIcon className="w-5 h-5" />}
          <span>Apply Background</span>
        </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-base-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-base-200 px-2 text-sm text-slate-400">Or</span>
        </div>
      </div>

      {/* Advanced Editing Section */}
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
          Advanced Editing
        </label>
        <textarea
          id="prompt"
          name="prompt"
          rows={3}
          className="block w-full rounded-md border-0 bg-base-300/50 py-1.5 text-slate-200 shadow-sm ring-1 ring-inset ring-base-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6 transition"
          placeholder="e.g., 'Add a retro filter' or 'Make the subject wear sunglasses'"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-3">
        <button
          onClick={onEdit}
          disabled={isLoading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white font-semibold rounded-md shadow-sm hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary disabled:bg-base-300 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <Loader /> : <SparklesIcon className="w-5 h-5" />}
          <span>Apply Advanced Edit</span>
        </button>

        <button
          onClick={onRemoveBg}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-secondary text-white font-semibold rounded-md shadow-sm hover:bg-brand-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-secondary disabled:bg-base-300 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <Loader /> : <MagicWandIcon className="w-5 h-5" />}
          <span>Remove Background (Transparent)</span>
        </button>

        {hasProcessedImage && (
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600/80 text-white font-semibold rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-emerald-500 disabled:opacity-50 transition-all"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>Download Image</span>
          </button>
        )}
      </div>
    </div>
  );
};