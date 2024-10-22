import express from 'express'
import { authMiddleware } from '../middlewares/auth';
import { getUser, createUser, updateUser, deleteUser, login } from '../controllers/auth';

const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/',createUser );

authRoutes.get('/',authMiddleware, getUser);
authRoutes.put('/:id',authMiddleware, updateUser);
authRoutes.delete('/:id',authMiddleware, deleteUser);

export default authRoutes;