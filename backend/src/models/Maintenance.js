const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      match: /^[1-9][0-9]{5}$/,
      index: true,
    },
    state: { type: String, default: "Unknown", index: true },
    area: { type: String, trim: true, maxlength: 120, default: "" },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    scheduledStart: { type: Date, required: true },
    scheduledEnd: { type: Date, required: true },
  },
  { timestamps: true }
);

maintenanceSchema.index({ scheduledStart: 1 });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
