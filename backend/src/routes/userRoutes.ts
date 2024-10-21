import { Router } from 'express';
import { getAllUsers, getUserById, createUserController } from '../controlllers/userController';

const router = Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/register', createUserController);

export default router;
