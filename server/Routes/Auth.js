import {signup,login,logout} from '../Controller/AuthController.js';
import express from 'express';
import { updateProfile } from '../Controller/AuthController.js';
import {protectedRoute} from "../Middleware/auth.middleware.js";
import {arcjetProtection} from '../Middleware/arcjet.middleware.js';
import User from '../Model/User.js';
const router = express.Router();
// router.use(arcjetProtection)
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/update-profile', protectedRoute, updateProfile);
router.get("/check", protectedRoute, (req, res) => res.status(200).json(req.user));
export default router;