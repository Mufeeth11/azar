import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Open SQLite database
export const getDb = async () => {
  return open({
    filename: path.join(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });
};

// Initialize the database table
export const initDb = async () => {
  try {
    const db = await getDb();
    // Create contacts table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create activities table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        detailed_description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create reviews table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        rating INTEGER NOT NULL,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create orders table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        details TEXT NOT NULL,
        amount INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Try to alter table to add amount to orders (migration)
    try {
      await db.exec(`ALTER TABLE orders ADD COLUMN amount INTEGER DEFAULT 0;`);
      console.log('Added amount column to orders table.');
    } catch (e: any) {
      if (!e.message.includes('duplicate column name')) {
        console.error('Migration note (orders amount):', e.message);
      }
    }

    // Create admins table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        profile_pic TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notifications table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        is_read BOOLEAN DEFAULT 0,
        link_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default admin if table is empty
    const adminCount = await db.get('SELECT COUNT(*) as count FROM admins');
    if (adminCount.count === 0) {
      await db.run(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        ['admin', 'admin123']
      );
      console.log('Default admin seeded.');
    }

    // Try to alter table to add detailed_description if it already exists (migration)
    try {
      await db.exec(`ALTER TABLE activities ADD COLUMN detailed_description TEXT;`);
      console.log('Added detailed_description column to activities table.');
    } catch (e: any) {
      if (!e.message.includes('duplicate column name')) {
        console.error('Migration note:', e.message);
      }
    }

    // Try to alter table to add email to reviews (migration)
    try {
      await db.exec(`ALTER TABLE reviews ADD COLUMN email TEXT;`);
      console.log('Added email column to reviews table.');
    } catch (e: any) {
      if (!e.message.includes('duplicate column name')) {
        console.error('Migration note (reviews email):', e.message);
      }
    }

    // Try to alter table to add phone to reviews (migration)
    try {
      await db.exec(`ALTER TABLE reviews ADD COLUMN phone TEXT;`);
      console.log('Added phone column to reviews table.');
    } catch (e: any) {
      if (!e.message.includes('duplicate column name')) {
        console.error('Migration note (reviews phone):', e.message);
      }
    }

    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
