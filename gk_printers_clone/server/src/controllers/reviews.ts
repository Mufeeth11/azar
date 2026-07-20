import { Request, Response } from 'express';
import { getDb } from '../config/database';
import nodemailer from 'nodemailer';

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const reviews = await db.all('SELECT * FROM reviews ORDER BY created_at DESC');
    
    res.status(200).json({ 
      count: reviews.length,
      reviews 
    });
  } catch (error) {
    console.error('Failed to retrieve reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, rating, text } = req.body;

    if (!name || !rating || !text || !email) {
      res.status(400).json({ error: 'Name, email, rating, and text are required.' });
      return;
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO reviews (name, email, rating, text) VALUES (?, ?, ?, ?)',
      [name, email, rating, text]
    );

    // Create a notification
    await db.run(
      'INSERT INTO notifications (title, message, type, link_id) VALUES (?, ?, ?, ?)',
      ['New Feedback', `New feedback received from ${name}`, 'feedback', result.lastID]
    );

    res.status(201).json({ 
      message: 'Review created successfully', 
      id: result.lastID 
    });
  } catch (error) {
    console.error('Failed to create review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'Review ID is required.' });
      return;
    }

    const db = await getDb();
    await db.run('DELETE FROM reviews WHERE id = ?', [id]);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Failed to delete review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const replyReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText) {
      res.status(400).json({ error: 'Reply text is required.' });
      return;
    }

    const db = await getDb();
    const review = await db.get('SELECT * FROM reviews WHERE id = ?', [id]);

    if (!review) {
      res.status(404).json({ error: 'Review not found.' });
      return;
    }
    
    if (!review.email) {
      res.status(400).json({ error: 'This review does not have an email address associated with it.' });
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

    const mailOptions = {
      from: process.env.SMTP_FROM || '"SR Digital Admin" <admin@srdigital.com>',
      to: review.email,
      subject: 'Re: Your Feedback to SR Digital',
      text: replyText,
      html: `<p>Hi ${review.name},</p>
             <p>Thank you for your feedback:</p>
             <blockquote style="border-left: 4px solid #00d284; padding-left: 10px; color: #555; margin-left: 0;"><i>"${review.text}"</i></blockquote>
             <p>${replyText.replace(/\n/g, '<br>')}</p>
             <br>
             <p>Best regards,<br><strong>SR Digital</strong></p>`
    };

    console.log(`Sending email to ${review.email}...`);

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
