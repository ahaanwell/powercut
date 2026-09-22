const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      match: /^[1-9][0-9]{5}$/,
      index: true,
    },
    state: {
      type: String,
      default: "Unknown",
      index: true,
    },
    area: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["reported", "ongoing", "restored"],
      default: "reported",
      index: true,
    },
    confirmCount: { type: Number, default: 0 },
    restoredCount: { type: Number, default: 0 },
    restoredAt: { type: Date, default: null },
    referenceId: { type: String, unique: true, sparse: true, index: true },
    reporterIpHash: { type: String, select: false },
  },
  { timestamps: true }
);

reportSchema.index({ pincode: 1, createdAt: -1 });
reportSchema.index({ state: 1, createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);
