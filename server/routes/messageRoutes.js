import express from "express";
import {createMessage, replyMessage} from "../controllers/messageController.js"

const router = express.Router();

router.post("/", createMessage);
router.put("/:id/reply", replyMessage);

export default router;
