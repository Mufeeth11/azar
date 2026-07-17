import { Router } from 'express';
import { submitContact, getContacts } from '../controllers/contact';

const router = Router();

router.post('/', submitContact);
router.get('/messages', getContacts);

export default router;
