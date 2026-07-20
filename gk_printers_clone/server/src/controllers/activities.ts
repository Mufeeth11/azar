import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const getActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const activities = await db.all('SELECT * FROM activities ORDER BY created_at DESC');

    res.status(200).json({
      count: activities.length,
      activities
    });
  } catch (error) {
    console.error('Failed to retrieve activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, detailed_description } = req.body;
    let image_url = req.body.image_url || null;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required.' });
      return;
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO activities (title, description, detailed_description, image_url) VALUES (?, ?, ?, ?)',
      [title, description, detailed_description || null, image_url]
    );

    res.status(201).json({
      message: 'Activity created successfully',
      id: result.lastID
    });
  } catch (error) {
    console.error('Failed to create activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, detailed_description } = req.body;
    let image_url = req.body.image_url;

    if (!id) {
      res.status(400).json({ error: 'Activity ID is required.' });
      return;
    }

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const db = await getDb();

    // If an image is provided (either new file or URL), update it.
    // If not, keep the existing one (we don't overwrite with null unless requested, but here let's assume we update if provided).
    // Actually, to make it robust, let's fetch the existing first.
    const existing = await db.get('SELECT * FROM activities WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    const finalImage = image_url !== undefined ? image_url : existing.image_url;

    await db.run(
      'UPDATE activities SET title = ?, description = ?, detailed_description = ?, image_url = ? WHERE id = ?',
      [title || existing.title, description || existing.description, detailed_description || existing.detailed_description, finalImage, id]
    );

    res.status(200).json({ message: 'Activity updated successfully' });
  } catch (error) {
    console.error('Failed to update activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Activity ID is required.' });
      return;
    }

    const db = await getDb();
    await db.run('DELETE FROM activities WHERE id = ?', [id]);

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Failed to delete activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
