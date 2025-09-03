import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDLY55AUjKLeCGZnMtHy5esvD-OUs2awWI';

const genAI = new GoogleGenerativeAI(API_KEY);

async function generateResponse(messages: any[], context: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro'});

  const chat = model.startChat({
    history: messages.map(m => ({
      role: m.role,
      parts: m.content
    })),
    generationConfig: {
      maxOutputTokens: 100,
    }
  });

  const result = await chat.sendMessage(messages[messages.length - 1].content);
  const response = await result.response;
  const text = response.text();
  return text;
}

export const chatbotService = {
  generateResponse,
};
