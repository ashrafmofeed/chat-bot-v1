
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatAreaProps {
  messages: Message[];
  isBotTyping: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isBotTyping }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  return (
    <main className="flex-grow p-4 sm:p-6 overflow-y-auto bg-slate-900 space-y-4">
      {messages.length === 0 && !isBotTyping && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <span className="text-7xl mb-6">👋</span>
          <p className="text-2xl text-slate-300">
            مرحبا بكم في عالم الذكاء الاصطناعي
          </p>
          <p className="text-lg text-slate-400 mt-2">
            أنا أرويه، كيف يمكنني مساعدتك اليوم؟
          </p>
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isBotTyping && (
        <div className="flex justify-start">
          <div className="bg-slate-700 text-slate-200 p-3 rounded-lg rounded-br-none max-w-xl shadow">
            <div className="flex items-center space-s-2" dir="ltr"> {/* LTR for typing dots */}
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></div>
              <span className="text-sm text-slate-400 ms-2">أرويه تكتب...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </main>
  );
};