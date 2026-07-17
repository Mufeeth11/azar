import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getActivities, createActivity, updateActivity, deleteActivity } from '../controllers/activities';

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const router = Router();

router.get('/', getActivities);
router.post('/', upload.single('image'), createActivity);
router.put('/:id', upload.single('image'), updateActivity);
router.delete('/:id', deleteActivity);

export default router;
