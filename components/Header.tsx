
import React from 'react';

interface HeaderProps {
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
  return (
    <header className="bg-slate-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        إسأل أرويه
      </h1>
      <button
        onClick={onNewChat}
        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        محادثة جديدة
      </button>
    </header>
  );
};