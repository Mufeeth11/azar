import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = await getDb();
    const admin = await db.get('SELECT id, username, profile_pic FROM admins WHERE username = ? AND password = ?', [username, password]);

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const admin = await db.get('SELECT id, username, profile_pic FROM admins WHERE id = ?', [id]);
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAdminProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, currentPassword, newPassword } = req.body;
    const db = await getDb();
    
    const admin = await db.get('SELECT * FROM admins WHERE id = ?', [id]);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    let updates: string[] = [];
    let params: any[] = [];

    // Verify current password if trying to set a new password
    if (newPassword) {
      if (admin.password !== currentPassword) {
        return res.status(401).json({ error: 'Incorrect current password' });
      }
      updates.push('password = ?');
      params.push(newPassword);
    }

    if (username && username !== admin.username) {
      updates.push('username = ?');
      params.push(username);
    }

    if (req.file) {
      updates.push('profile_pic = ?');
      params.push(`/uploads/${req.file.filename}`);
    }

    if (updates.length > 0) {
      params.push(id);
      await db.run(`UPDATE admins SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const updatedAdmin = await db.get('SELECT id, username, profile_pic FROM admins WHERE id = ?', [id]);
    res.status(200).json({ message: 'Profile updated successfully', admin: updatedAdmin });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
