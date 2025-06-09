// Speech Recognition API Types
export interface SpeechRecognitionStatic {
  new(): ISpeechRecognition;
}

export interface ISpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI?: string; 

  onaudiostart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;

  abort(): void;
  start(): void;
  stop(): void;
}

export interface SpeechGrammar {
  src: string;
  weight?: number;
}
export interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
  [index: number]: SpeechGrammar;
}

export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  readonly interpretation?: any; 
  readonly emma?: Document | null;
}

export type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

// Custom error type used by the application's onError callback in speechService
export interface CustomSpeechRecognitionError {
  error: SpeechRecognitionErrorCode | 'not-supported' | 'start-failed' | 'permission-denied' | string;
  message: string;
}

// Augment the Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
    // SpeechSynthesisUtterance and speechSynthesis are typically part of lib.dom.d.ts
  }
}

// Existing application types
export enum MessageSender {
  USER = 'أنت', 
  BOT = 'أرويه', 
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
}