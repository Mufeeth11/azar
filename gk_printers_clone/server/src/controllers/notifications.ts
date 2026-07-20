import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const notifications = await db.all('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20');
    const unreadCount = await db.get('SELECT COUNT(*) as count FROM notifications WHERE is_read = 0');
    
    res.status(200).json({ notifications, unreadCount: unreadCount.count });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    await db.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await db.run('UPDATE notifications SET is_read = 1 WHERE is_read = 0');
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
