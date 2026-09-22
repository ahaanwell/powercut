const ContactMessage = require("../models/ContactMessage");
const hashIp = require("../utils/hashIp");

const CATEGORIES = ["bug", "feedback", "general"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createContactMessage(req, res, next) {
  try {
    const { category = "general", message = "", name = "", email = "" } = req.body;

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    const trimmedMessage = message.toString().trim();
    if (trimmedMessage.length === 0 || trimmedMessage.length > 2000) {
      return res.status(400).json({ message: "Message must be 1-2000 characters" });
    }
    const trimmedEmail = email.toString().trim();
    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address, or leave it blank" });
    }

    const contactMessage = await ContactMessage.create({
      category,
      message: trimmedMessage,
      name: name.toString().trim().slice(0, 100),
      email: trimmedEmail,
      reporterIpHash: hashIp(req),
    });

    res.status(201).json({
      _id: contactMessage._id,
      category: contactMessage.category,
      createdAt: contactMessage.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createContactMessage };
