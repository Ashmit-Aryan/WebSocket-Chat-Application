import {
    addContact,
    acceptContact,
    rejectContact,
    getAllContacts,
    removeContact
} from "../Controller/ContactController.js"

import express from "express";
import {protectedRoute} from "../Middleware/auth.middleware.js";
import {arcjetProtection} from "../Middleware/arcjet.middleware.js";

const router = express.Router();
router.use(protectedRoute,arcjetProtection);
router.get("/", getAllContacts);
router.post("/request/:id", addContact);
router.post("/accept/:id", acceptContact);
router.post("/reject/:id", rejectContact);
router.post("/remove/:id", removeContact);

export default router;