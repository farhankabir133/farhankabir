
import { ChatMessage, ChatContext } from '../types/chatbot';

const API_URL = '/api/chatbot';

const generateResponse = async (messages: ChatMessage[], context: ChatContext): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, context }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.content) {
      throw new Error('Invalid response from API');
    }

    return data.content;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm sorry, I encountered an error. Please try again or contact Farhan directly at farhankabir133@gmail.com";
  }
};

export const chatbotService = {
  generateResponse,
};
