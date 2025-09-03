require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Serve React static files in production
const clientBuildPath = path.join(__dirname, '../dist');
if (process.env.NODE_ENV === 'production' && require('fs').existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
}

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `\"${name}\" <${email}>`,
      to: 'farhankabir133@gmail.com',
      subject: subject,
      text: message,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br>${message}</p>`
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

app.post('/api/chatbot', async (req, res) => {
    const { messages } = req.body;

    if (!messages) {
        return res.status(400).json({ error: 'Messages are required.' });
    }

    const prompt = `This is a conversation with an AI assistant for Farhan Kabir, a software developer.\nThe assistant is helpful, creative, and friendly.\n\nHere is the conversation history:\n${messages.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}\n\nAssistant:`

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ content: text });
    } catch (error) {
        console.error("Error generating response from Gemini API:", error);
        res.status(500).json({ error: 'Failed to generate response.' });
    }
});


// Fallback: serve index.html for any unknown route (SPA)
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production' && require('fs').existsSync(clientBuildPath)) {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});