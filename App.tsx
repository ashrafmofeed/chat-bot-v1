
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ChatArea }  from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { Footer } from './components/Footer';
import { Message, MessageSender, ISpeechRecognition, CustomSpeechRecognitionError } from './types';
import { initGeminiChat, sendMessageToGemini } from './services/geminiService';
import { startListening, stopListening, speakText, isSpeechRecognitionSupported, isSpeechSynthesisSupported } from './services/speechService';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const SCRIPT_NOT_SUPPORTED_MESSAGE = "عذراً، متصفحك لا يدعم خاصية التعرف على الصوت أو النطق.";

  useEffect(() => {
    if (!isSpeechRecognitionSupported() || !isSpeechSynthesisSupported()) {
      setError(SCRIPT_NOT_SUPPORTED_MESSAGE);
    }
    initializeChat();
  }, []);

  const initializeChat = useCallback(() => {
    try {
      const newChatSession = initGeminiChat();
      setChatSession(newChatSession);
      setMessages([]);
      setError(null);
    } catch (e) {
      console.error("Failed to initialize Gemini Chat:", e);
      setError("فشل في تهيئة المحادثة مع الذكاء الاصطناعي. يرجى التحقق من مفتاح API.");
    }
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !chatSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: MessageSender.USER,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsBotTyping(true);
    setError(null); // Clear previous errors

    try {
      const botResponseText = await sendMessageToGemini(chatSession, text.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: MessageSender.BOT,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      if (isSpeechSynthesisSupported()) {
        speakText(botResponseText, () => {});
      }
    } catch (e) {
      console.error("Error sending message to Gemini:", e);
      const errText = e instanceof Error ? e.message : "عذراً، حدث خطأ أثناء معالجة طلبك.";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errText,
        sender: MessageSender.BOT,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(errText);
    } finally {
      setIsBotTyping(false);
    }
  }, [chatSession]);

  const handleVoiceInput = useCallback(() => {
    if (!isSpeechRecognitionSupported()) {
      setError(SCRIPT_NOT_SUPPORTED_MESSAGE);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        stopListening(recognitionRef.current);
      }
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current = startListening(
        (transcript, isFinal) => {
          setCurrentMessage(transcript);
          if (isFinal) {
            handleSendMessage(transcript);
            setIsListening(false); 
            if (recognitionRef.current) { // Ensure stop is called if isFinal is true
                stopListening(recognitionRef.current);
            }
          }
        },
        () => { // onEnd
          setIsListening(false);
          // If currentMessage has content from interim results and listening ends due to timeout/etc.
          if (currentMessage.trim() && !isFinalTranscriptReceived.current) {
            handleSendMessage(currentMessage.trim());
          }
          isFinalTranscriptReceived.current = false; // Reset for next session
        },
        (err: CustomSpeechRecognitionError) => {
          console.error("Speech recognition error:", err);
          setError(`خطأ في التعرف على الصوت: ${err.message} (الكود: ${err.error})`);
          setIsListening(false);
        }
      );
      isFinalTranscriptReceived.current = false; // Reset flag at start of listening
    }
  }, [isListening, handleSendMessage, currentMessage]);
  
  // Ref to track if a final transcript was processed by onResult callback
  const isFinalTranscriptReceived = useRef(false);

  // Effect to update isFinalTranscriptReceived when onResult provides a final transcript
  useEffect(() => {
    if (isListening) { // Only relevant while listening
        const originalOnResult = recognitionRef.current?.onresult;
        if (recognitionRef.current) {
            recognitionRef.current.onresult = (event) => {
                if(originalOnResult) originalOnResult.call(recognitionRef.current, event);
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        isFinalTranscriptReceived.current = true;
                        break;
                    }
                }
            };
        }
        return () => { // Cleanup: restore original onresult if necessary
            if (recognitionRef.current && originalOnResult) {
                recognitionRef.current.onresult = originalOnResult;
            }
        }
    }
  }, [isListening]);


  // Cleanup speech recognition on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        stopListening(recognitionRef.current);
      }
      // also cancel any ongoing speech synthesis
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);


  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100" dir="rtl">
      <Header onNewChat={initializeChat} />
      {error && !messages.find(msg => msg.text === error && msg.sender === MessageSender.BOT) && ( // Display global error if not already shown as a bot message
        <div className="p-3 bg-red-600 text-white text-center text-sm shadow-md">
          {error}
          <button onClick={() => setError(null)} className="ms-4 text-sm underline">إخفاء</button>
        </div>
      )}
      <ChatArea messages={messages} isBotTyping={isBotTyping} />
      <InputArea
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        onSendMessage={() => handleSendMessage(currentMessage)}
        isListening={isListening}
        onToggleListen={handleVoiceInput}
        disabled={isBotTyping || !chatSession}
      />
      <Footer />
    </div>
  );
};

export default App;