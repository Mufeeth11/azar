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

    // Try to alter table to add detailed_description if it already exists (migration)
    try {
      await db.exec(`ALTER TABLE activities ADD COLUMN detailed_description TEXT;`);
      console.log('Added detailed_description column to activities table.');
    } catch (e: any) {
      // Ignore error if column already exists (sqlite error code for duplicate column)
      if (!e.message.includes('duplicate column name')) {
        console.error('Migration note:', e.message);
      }
    }

    console.log('SQLite database initialized.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
