import {
    addContact,
    acceptContact,
    rejectContact,
    getAllContacts
} from "../Controller/ContactController.js"

import express from "express";
import protectedRoute from "../Middleware/auth.middleware.js";


const router = express.Router();

router.get("/", protectedRoute, getAllContacts);
router.post("/request/:id", protectedRoute, addContact);
router.post("/accept/:id", protectedRoute, acceptContact);
router.post("/reject/:id", protectedRoute, rejectContact);

export default router;