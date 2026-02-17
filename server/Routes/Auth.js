import {signup,login,logout} from '../Controller/AuthController.js';
import express from 'express';
import { updateProfile } from '../Controller/AuthController.js';
import {protectedRoute} from "../Middleware/auth.middleware.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/update-profile', protectedRoute, updateProfile);

export default router;