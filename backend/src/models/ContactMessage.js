const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["bug", "feedback", "general"],
      default: "general",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    name: { type: String, trim: true, maxlength: 100, default: "" },
    email: { type: String, trim: true, maxlength: 200, default: "" },
    reporterIpHash: { type: String, select: false },
  },
  { timestamps: true }
);

contactMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
