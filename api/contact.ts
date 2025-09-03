
import { Resend } from 'resend';

// The 'any' type is used here to ensure compatibility with various serverless function environments.
// If you are deploying to Vercel, you could use the VercelRequest and VercelResponse types.
export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    // Ensure you have the VITE_RESEND_API_KEY in your .env file
    const resend = new Resend(process.env.VITE_RESEND_API_KEY);
    
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      // You will need to have a verified domain in Resend to use a custom 'from' address.
      // For testing, you can use 'onboarding@resend.dev'.
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['farhankabir133@gmail.com'], // Set your receiving email address here
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });

      if (error) {
        console.error({ error });
        return res.status(500).json({ error: 'Failed to send email.' });
      }

      return res.status(200).json({ message: 'Message sent successfully!', data });
    } catch (exception) {
      console.error(exception);
      return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
