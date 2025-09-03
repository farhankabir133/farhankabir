require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { messages } = JSON.parse(event.body);

    if (!messages) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Messages are required.' }) };
    }

    const prompt = `This is a conversation with an AI assistant for Farhan Kabir, a software developer.\nThe assistant is helpful, creative, and friendly.\n\nHere is the conversation history:\n${messages.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}\n\nAssistant:`

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return { statusCode: 200, body: JSON.stringify({ content: text }) };
    } catch (error) {
        console.error("Error generating response from Gemini API:", error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to generate response.' }) };
    }
};