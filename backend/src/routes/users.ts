import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, getUsersSummary } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Add a test route without authentication for testing
router.post('/test', createUser);

router.get('/', authenticate, getUsers);
router.post('/', authenticate, createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);
router.get('/summary', authenticate, getUsersSummary);

export default router;