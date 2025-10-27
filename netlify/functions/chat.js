const OpenAI = require('openai');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { messages, context: chatContext } = JSON.parse(event.body);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // A default system message can be set here
  const systemMessage = {
    role: "system",
    content: "You are a helpful AI assistant representing Farhan, a skilled software developer. Your goal is to provide concise and relevant information about his skills, experience, and projects. You should be friendly, professional, and always aim to encourage users to connect with Farhan. If a user expresses interest in hiring or collaborating, you should proactively ask for their contact information.",
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [systemMessage, ...messages],
      temperature: 0.7, // Adjust for creativity vs. factuality
      max_tokens: 250, // Adjust based on desired response length
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.choices[0].message.content }),
    };
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get response from AI." }),
    };
  }
};
