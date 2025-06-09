
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// IMPORTANT: Replace "YOUR_GEMINI_API_KEY" with your actual API key or ensure 
// process.env.API_KEY is set in your build environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is missing. Please set the API_KEY environment variable.");
  // Potentially throw an error or handle this state in the UI
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Use ! assuming it will be provided

const SYSTEM_INSTRUCTION = "أنتِ أرويه، مذيعة افتراضية في شركة ليو ميديا. مهمتك هي الرد على تساؤلات زوار منصة الذكاء الاصطناعي في ليوميديا. تحدثي باللهجة المصرية العامية. اسمك أرويه.";

export const initGeminiChat = (): Chat => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash-preview-04-17',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      // Omitting thinkingConfig to default to enabled thinking for higher quality.
    },
    // History is managed by the Chat object itself.
    // history: [] 
  });
  return chat;
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    // The `.text` property directly provides the string output.
    return response.text;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    // Consider more specific error handling based on error types from @google/genai if available
    if (error instanceof Error) {
        // Check for common API errors
        if (error.message.includes("API key not valid")) {
            throw new Error("عذراً، يبدو أن هناك مشكلة في مفتاح API. يرجى التحقق منه.");
        }
        if (error.message.includes("quota")) {
            throw new Error("عذراً، لقد تجاوزت حصتك من استخدام واجهة برمجة التطبيقات.");
        }
         throw new Error(error.message); // Rethrow other specific errors
    }
    throw new Error('عذراً، حدث خطأ غير متوقع أثناء الاتصال بالذكاء الاصطناعي.');
  }
};