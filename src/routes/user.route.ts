import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();

router.post('/register-user', UserController.registerUser);
router.post('/register-admin', UserController.registerAdmin);
router.post('/login', UserController.login);

export default router;