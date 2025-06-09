
import React from 'react';
import { Message, MessageSender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-lg lg:max-w-xl px-4 py-3 rounded-xl shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none'
            : 'bg-slate-700 text-slate-200 rounded-bl-none'
        }`}
      >
        <p className="text-sm font-semibold mb-1">{message.sender}</p>
        <p className="text-md whitespace-pre-wrap">{message.text}</p>
        <p className={`text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-slate-400'} text-start`}>
          {new Date(message.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};