import { Router } from 'express';
import { getReviews, createReview, deleteReview, replyReview } from '../controllers/reviews';

const router = Router();

router.get('/', getReviews);
router.post('/', createReview);
router.delete('/:id', deleteReview);
router.post('/:id/reply', replyReview);

export default router;
