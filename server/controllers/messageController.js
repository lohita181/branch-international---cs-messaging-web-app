import express from "express";
import Message from "../models/Message.js";

export const createMessage = async(req, res) => {
    const message = await Message.create(req.body);
    res.status(201).json(message);
}

export const replyMessage = async(req, res) => {
    const {id} = req.params;
    const updated = await Message.findByIdAndUpdate(
        id, 
        {
            agentReply: req.body.agentReply,
            status:"replied",
            repliedAt: new Date()
        },
        {new: true}
    )
    res.json(updated);
}