import express from "express";
import Message from "../models/Message.js";

export const createMessage = async(req, res) => {
    const { urgencyLevel } = determineUrgency(req.body.messageText);
    const message = await Message.create({
      ...req.body,
      urgency: urgencyLevel,
    });
    res.status(201).json(message);
}

export const replyMessage = async(req, res) => {

    const {id} = req.params;
    const updated = await Message.findByIdAndUpdate(
        id, 
        {
            agentReply: req.body.reply,
            status:"replied",
            repliedAt: new Date()
        },
        {new: true}
    )
    console.log(updated);
    res.json(updated);
}

export const getAllMessages = async(req, res) => {
    const messages = await Message.find();

        res.json(messages);
}

export const getMessageByUrgency = async(req, res) => {
    const {urgency} = req.params;
    const messageByUrgency = await Message.find({urgency:urgency});
    res.json(messageByUrgency);
}

function determineUrgency(messageText) {
  const text = messageText.toLowerCase();

  let score = 0;

  const highUrgencyKeywords = [
    "loan",
    "emi",
    "due today",
    "not credited",
    "pending",
    "delay",
    "rejected"
  ];

  const mediumUrgencyKeywords = [
    "verification",
    "document",
    "status"
  ];

  const lowUrgencyKeywords = [
    "update",
    "change",
    "profile",
    "email",
    "phone",
    "password"
  ];

  for (const word of highUrgencyKeywords) {
    if (text.includes(word)) score += 5;
  }

  for (const word of mediumUrgencyKeywords) {
    if (text.includes(word)) score += 3;
  }

  for (const word of lowUrgencyKeywords) {
    if (text.includes(word)) score += 1;
  }

  let level = "low";
  if (score >= 5) level = "high";
  else if (score >= 3) level = "medium";

  return {
    urgencyLevel: level
  };
}
