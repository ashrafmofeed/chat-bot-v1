
import React from 'react';
import { MicrophoneIcon, PaperAirplaneIcon } from './Icons';

interface InputAreaProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  onSendMessage: () => void;
  isListening: boolean;
  onToggleListen: () => void;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
  currentMessage,
  setCurrentMessage,
  onSendMessage,
  isListening,
  onToggleListen,
  disabled = false,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) onSendMessage();
    }
  };

  return (
    <footer className="bg-slate-800 p-4 shadow-top sticky bottom-0">
      <div className="flex items-center bg-slate-700 rounded-xl p-2">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="أرسل رسالة لـ أرويه..."
          className="flex-grow bg-transparent text-slate-100 placeholder-slate-400 focus:outline-none px-3 py-2"
          disabled={disabled}
          dir="auto" 
        />
        <button
          onClick={onToggleListen}
          className={`p-3 rounded-full transition-colors duration-200 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 speak-button-glow' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white me-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50`}
          aria-label={isListening ? 'إيقاف الاستماع' : 'بدء الاستماع'}
          disabled={disabled && !isListening} 
        >
          <MicrophoneIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onSendMessage}
          className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
          aria-label="إرسال الرسالة"
          disabled={disabled || !currentMessage.trim()}
        >
          <PaperAirplaneIcon className="w-6 h-6" />
        </button>
      </div>
    </footer>
  );
};