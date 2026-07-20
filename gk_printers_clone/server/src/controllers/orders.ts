import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer_name, email, phone, details } = req.body;
    
    if (!customer_name || !details) {
      res.status(400).json({ error: 'Name and details are required' });
      return;
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO orders (customer_name, email, phone, details, status) VALUES (?, ?, ?, ?, ?)',
      [customer_name, email, phone, details, 'Pending']
    );

    // Create a notification
    await db.run(
      'INSERT INTO notifications (title, message, type, link_id) VALUES (?, ?, ?, ?)',
      ['New Order', `New order received from ${customer_name}`, 'order', result.lastID]
    );

    res.status(201).json({ 
      message: 'Order created successfully',
      orderId: result.lastID 
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, amount } = req.body;

    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    const db = await getDb();
    
    if (amount !== undefined) {
      await db.run(
        'UPDATE orders SET status = ?, amount = ? WHERE id = ?',
        [status, amount, id]
      );
    } else {
      await db.run(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );
    }

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    
    await db.run('DELETE FROM orders WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Failed to delete order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
