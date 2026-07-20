import { Router } from 'express';
import { submitContact, getContacts, replyMessage } from '../controllers/contact';

const router = Router();

router.post('/', submitContact);
router.get('/messages', getContacts);
router.post('/messages/:id/reply', replyMessage);

export default router;
