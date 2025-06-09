
import type { ISpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent, CustomSpeechRecognitionError } from '../types';

const SpeechRecognitionGlobal = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : undefined;

export const isSpeechRecognitionSupported = (): boolean => !!SpeechRecognitionGlobal;
export const isSpeechSynthesisSupported = (): boolean => typeof window !== 'undefined' && 'speechSynthesis' in window;

let availableVoices: SpeechSynthesisVoice[] = [];

const loadVoices = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    availableVoices = window.speechSynthesis.getVoices();
  }
};

// Load voices initially and on voiceschanged event
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices(); // Initial attempt
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}


export const startListening = (
  onResult: (transcript: string, isFinal: boolean) => void,
  onEnd: () => void,
  onError: (error: CustomSpeechRecognitionError) => void
): ISpeechRecognition | null => {
  if (!SpeechRecognitionGlobal) {
    console.error('Speech recognition not supported.');
    onError({ error: 'not-supported', message: 'خاصية التعرف على الصوت غير مدعومة في هذا المتصفح.' });
    return null;
  }

  const recognition: ISpeechRecognition = new SpeechRecognitionGlobal();
  recognition.lang = 'ar-SA'; // Arabic - Saudi Arabia (standard for input, output voice is separate)
  recognition.interimResults = true;
  recognition.continuous = true; 

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    
    if (finalTranscript) {
      onResult(finalTranscript.trim(), true);
    } else if (interimTranscript) {
      onResult(interimTranscript, false);
    }
  };

  recognition.onend = () => {
    onEnd();
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error:', event.error, event.message);
    let customMessage = event.message;
    if (event.error === 'no-speech') customMessage = "لم يتم اكتشاف أي كلام. حاول التحدث بوضوح.";
    else if (event.error === 'audio-capture') customMessage = "مشكلة في التقاط الصوت. تحقق من الميكروفون.";
    else if (event.error === 'not-allowed') customMessage = "تم رفض إذن استخدام الميكروفون.";
    else if (event.error === 'network') customMessage = "مشكلة في الشبكة أثناء التعرف على الصوت.";
    
    onError({ error: event.error, message: customMessage || `حدث خطأ غير معروف: ${event.error}` });
  };
  
  try {
    recognition.start();
  } catch (e) {
     console.error('Error starting speech recognition:', e);
     const errorMessage = e instanceof Error ? e.message : 'Could not start recognition';
     onError({ error: 'start-failed', message: `فشل بدء التعرف على الصوت: ${errorMessage}` });
     return null;
  }
  return recognition;
};

export const stopListening = (recognitionInstance: ISpeechRecognition | null): void => {
  if (recognitionInstance) {
    try {
        recognitionInstance.stop();
    } catch(e) {
        console.warn("Error stopping recognition, it might have already stopped:", e);
    }
  }
};

export const speakText = (text: string, onEndCallback?: () => void): void => {
  if (!isSpeechSynthesisSupported() || typeof window === 'undefined') {
    console.error('Speech synthesis not supported.');
    if (onEndCallback) onEndCallback(); 
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  
  // Ensure voices are loaded if they were not available initially
  if (availableVoices.length === 0) {
    loadVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-EG'; // Set to Egyptian Arabic
  utterance.pitch = 1;
  utterance.rate = 1; 
  utterance.volume = 1;

  // Attempt to find a suitable female voice
  let selectedVoice = availableVoices.find(voice => 
    voice.lang === 'ar-EG' && (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('أنثى'))
  );
  
  if (!selectedVoice) {
    selectedVoice = availableVoices.find(voice => 
      voice.lang.startsWith('ar-') && (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('أنثى'))
    );
  }

  if (!selectedVoice) {
    selectedVoice = availableVoices.find(voice => voice.lang === 'ar-EG');
  }
  
  if (!selectedVoice) {
    selectedVoice = availableVoices.find(voice => voice.lang.startsWith('ar-'));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    // console.log("Using voice:", selectedVoice.name, selectedVoice.lang);
  } else {
    // console.log("Using default voice for lang:", utterance.lang);
  }

  utterance.onend = () => {
    if (onEndCallback) {
      onEndCallback();
    }
  };

  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    if (onEndCallback) {
      onEndCallback(); 
    }
  };
  
  window.speechSynthesis.speak(utterance);
};