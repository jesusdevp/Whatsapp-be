import express from "express";
import trimRequest from "trim-request";
import authMiddleware from '../middlewares/auth.middleware.js';
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.route('/').post(trimRequest.all, authMiddleware, sendMessage);
router.route('/:conver_id').get(trimRequest.all, authMiddleware, getMessages);
export default router;