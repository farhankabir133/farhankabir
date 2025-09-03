require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { name, email, subject, message } = JSON.parse(event.body);
    if (!name || !email || !subject || !message) {
        return { statusCode: 400, body: JSON.stringify({ error: 'All fields are required.' }) };
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

        return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Message sent successfully!' }) };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send message.' }) };
    }
};