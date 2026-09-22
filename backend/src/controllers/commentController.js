const Comment = require("../models/Comment");

async function createComment(req, res, next) {
  try {
    const { pincode, name = "", message = "" } = req.body;

    if (!/^[1-9][0-9]{5}$/.test(pincode || "")) {
      return res.status(400).json({ message: "Invalid pincode format" });
    }
    const trimmedMessage = message.toString().trim();
    if (trimmedMessage.length === 0 || trimmedMessage.length > 280) {
      return res.status(400).json({ message: "Message must be 1-280 characters" });
    }

    const comment = await Comment.create({
      pincode,
      name: name.toString().trim().slice(0, 60),
      message: trimmedMessage,
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

async function getRecentComments(req, res, next) {
  try {
    const { pincode } = req.params;
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      return res.status(400).json({ message: "Invalid pincode format" });
    }

    const hours = Math.min(Number(req.query.hours) || 48, 24 * 30);
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const comments = await Comment.find({ pincode, createdAt: { $gte: since } })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ comments });
  } catch (err) {
    next(err);
  }
}

module.exports = { createComment, getRecentComments };
