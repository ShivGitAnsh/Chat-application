import express from "express";
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { summarizeMessages } from "../controllers/summarize.controller.js";


const router = express.Router()

router.post("/summarize-unread", isAuthenticated, summarizeMessages);

export default router;