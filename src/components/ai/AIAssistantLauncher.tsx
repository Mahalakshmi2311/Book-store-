import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIAssistantLauncher: React.FC = () => {
  const { isAIAssistantOpen, openAIAssistant } = useApp();

  if (isAIAssistantOpen) return null;

  return (
    <button
      type="button"
      onClick={() => openAIAssistant()}
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label="Open AI Book Recommendation Assistant"
    >
      <div className="relative">
        <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-blue-600" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold leading-none tracking-wide flex items-center gap-1">
          Ask AI Assistant
        </span>
        <span className="text-[10px] text-blue-200 leading-tight">
          Find your next read
        </span>
      </div>
    </button>
  );
};
