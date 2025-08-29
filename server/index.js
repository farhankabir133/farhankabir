require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

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
      from: `"${name}" <${email}>`,
      to: 'farhankabir133@gmail.com',
      subject: subject,
      text: message,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br>${message}</p>`
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message.' });
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
