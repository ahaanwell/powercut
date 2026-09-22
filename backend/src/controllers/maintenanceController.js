const Maintenance = require("../models/Maintenance");

async function listUpcomingMaintenance(req, res, next) {
  try {
    const filter = { scheduledEnd: { $gte: new Date() } };
    if (req.query.pincode && /^[1-9][0-9]{5}$/.test(req.query.pincode)) {
      filter.pincode = req.query.pincode;
    }

    const items = await Maintenance.find(filter).sort({ scheduledStart: 1 }).limit(100);
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUpcomingMaintenance };
