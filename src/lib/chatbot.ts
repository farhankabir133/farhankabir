import { ChatMessage, ChatContext } from '../types/chatbot';

export const chatbotService = {
  async generateResponse(messages: ChatMessage[], context: ChatContext): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, context }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Error calling chat API:", error);
      throw new Error("Failed to get response from AI");
    }
  },
};
