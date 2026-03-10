import express from "express";
import { getMessagesByUserId,sendMessage,getChatPartners } from "../Controller/MessageController.js";
import { protectedRoute } from "../Middleware/auth.middleware.js"
import {arcjetProtection} from "../Middleware/arcjet.middleware.js";


const router = express.Router();

router.use(arcjetProtection,protectedRoute);

router.get("/chats",getChatPartners);
router.get("/:id",getMessagesByUserId);
router.post("/send/:id",sendMessage);

export default router;