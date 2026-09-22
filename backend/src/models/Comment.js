const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      match: /^[1-9][0-9]{5}$/,
      index: true,
    },
    name: { type: String, trim: true, maxlength: 60, default: "" },
    message: { type: String, trim: true, maxlength: 280, required: true },
  },
  { timestamps: true }
);

commentSchema.index({ pincode: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
