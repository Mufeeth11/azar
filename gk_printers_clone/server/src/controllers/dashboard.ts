import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    
    const ordersResult = await db.get('SELECT COUNT(*) as count FROM orders');
    const messagesResult = await db.get('SELECT COUNT(*) as count FROM contacts');
    const feedbackResult = await db.get('SELECT COUNT(*) as count FROM reviews');
    
    // Revenue calculations
    const totalRevResult = await db.get("SELECT SUM(amount) as total FROM orders WHERE status = 'Delivered'");
    const todayRevResult = await db.get("SELECT SUM(amount) as total FROM orders WHERE status = 'Delivered' AND date(created_at, 'localtime') = date('now', 'localtime')");

    // Orders calculations
    const pendingOrdersResult = await db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'");
    const todayOrdersResult = await db.get("SELECT COUNT(*) as count FROM orders WHERE date(created_at, 'localtime') = date('now', 'localtime')");

    // Users calculations (from users table)
    const totalUsersResult = await db.get('SELECT COUNT(*) as count FROM users');

    // Active Users (registered in the last 30 days)
    const activeUsersResult = await db.get(`
      SELECT COUNT(*) as count FROM users WHERE date(created_at) >= date('now', '-30 days')
    `);

    // Recent Activities (from notifications table)
    const recentActivities = await db.all('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5');

    res.status(200).json({ 
      orders: ordersResult.count,
      messages: messagesResult.count,
      feedback: feedbackResult.count,
      revenue: totalRevResult.total || 0,
      todayRevenue: todayRevResult.total || 0,
      pendingOrders: pendingOrdersResult.count || 0,
      todayOrders: todayOrdersResult.count || 0,
      totalUsers: totalUsersResult.count || 0,
      activeUsers: activeUsersResult.count || 0,
      recentActivities: recentActivities
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
