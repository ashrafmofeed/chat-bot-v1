
import React from 'react';

interface IconProps {
  className?: string;
}

export const MicrophoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" />
    <path d="M19 12a1 1 0 00-1 1v.5a6 6 0 01-12 0V13a1 1 0 00-2 0v.5a8 8 0 007 7.93V23a1 1 0 002 0v-1.57A8 8 0 0019 13.5V12a1 1 0 00-1-1z" />
  </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);