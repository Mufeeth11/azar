import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !email || !message) {
      res.status(400).json({ error: 'First name, email, and message are required.' });
      return;
    }

    // In a real application, create a table named 'contacts' in Supabase
    // const { data, error } = await supabase.from('contacts').insert([
    //   { first_name: firstName, last_name: lastName, email, phone, message }
    // ]);

    // if (error) throw error;
    
    // Simulating database insertion for demonstration since we don't have actual Supabase credentials here
    console.log('Received contact submission:', { firstName, lastName, email, phone, message });
    
    res.status(200).json({ message: 'Contact submitted successfully', data: { firstName, lastName, email, phone, message } });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
