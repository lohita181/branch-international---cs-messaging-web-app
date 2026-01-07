import express from "express";
import {createMessage, replyMessage, getAllMessages, getMessageByUrgency} from "../controllers/messageController.js"

const router = express.Router();

router.post("/", createMessage);
router.patch("/:id/reply", replyMessage);
router.get("/", getAllMessages);
router.get("/", getMessageByUrgency);

export default router;
