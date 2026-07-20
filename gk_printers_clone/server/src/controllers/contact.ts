import { Request, Response } from 'express';
import { getDb } from '../config/database';
import nodemailer from 'nodemailer';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !email || !message) {
      res.status(400).json({ error: 'First name, email, and message are required.' });
      return;
    }

    // Insert into local SQLite database
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO contacts (first_name, last_name, email, phone, message) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone, message]
    );

    // Create a notification
    await db.run(
      'INSERT INTO notifications (title, message, type, link_id) VALUES (?, ?, ?, ?)',
      ['New Message', `New contact message from ${firstName} ${lastName}`, 'message', result.lastID]
    );

    console.log('Successfully saved contact submission to local SQLite database.');
    
    res.status(200).json({ message: 'Contact submitted successfully', data: { firstName, lastName, email, phone, message } });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const messages = await db.all('SELECT * FROM contacts ORDER BY created_at DESC');
    
    res.status(200).json({ 
      count: messages.length,
      messages 
    });
  } catch (error) {
    console.error('Failed to retrieve contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const replyMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText) {
      res.status(400).json({ error: 'Reply text is required.' });
      return;
    }

    const db = await getDb();
    const message = await db.get('SELECT * FROM contacts WHERE id = ?', [id]);

    if (!message) {
      res.status(404).json({ error: 'Message not found.' });
      return;
    }

    let transporter;
    let isTestAccount = false;
    
    if (process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      // Generate a test account on the fly
      const testAccount = await nodemailer.createTestAccount();
      isTestAccount = true;
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    // Send email
    const mailOptions = {
      from: process.env.SMTP_FROM || '"SR Digital Admin" <admin@srdigital.com>',
      to: message.email,
      subject: 'Re: Your message to SR Digital',
      text: replyText,
      html: `<p>Hi ${message.first_name},</p>
             <p>In response to your message:</p>
             <blockquote style="border-left: 4px solid #00d284; padding-left: 10px; color: #555; margin-left: 0;"><i>"${message.message}"</i></blockquote>
             <p>${replyText.replace(/\n/g, '<br>')}</p>
             <br>
             <p>Best regards,<br><strong>SR Digital</strong></p>`
    };

    console.log(`Sending email to ${message.email}...`);
    
    const info = await transporter.sendMail(mailOptions);
    let previewUrl = null;
    
    if (isTestAccount) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL: ' + previewUrl);
    }

    res.status(200).json({ 
      message: 'Reply sent successfully',
      previewUrl
    });
  } catch (error) {
    console.error('Failed to send reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
