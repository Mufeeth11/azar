import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !email || !message) {
      res.status(400).json({ error: 'First name, email, and message are required.' });
      return;
    }

    // Insert into local SQLite database
    const db = await getDb();
    await db.run(
      'INSERT INTO contacts (first_name, last_name, email, phone, message) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone, message]
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
