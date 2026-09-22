const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Report = require("../models/Report");
const { getStateFromPincode } = require("../utils/pincodeState");
const hashIp = require("../utils/hashIp");

function generateReferenceId() {
  const _id = new mongoose.Types.ObjectId();
  const referenceId = `PCT-${new Date().getFullYear()}-${_id.toString().slice(-8).toUpperCase()}`;
  return { _id, referenceId };
}

const RESTORED_CONFIRMATIONS_THRESHOLD = 3;

async function createReport(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { pincode, area = "", description = "", status = "reported" } = req.body;
    const ipHash = hashIp(req);

    const recentDuplicate = await Report.findOne({
      pincode,
      reporterIpHash: ipHash,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
    });
    if (recentDuplicate) {
      return res.status(429).json({ message: "You already reported this pincode recently." });
    }

    const { _id, referenceId } = generateReferenceId();
    const report = await Report.create({
      _id,
      referenceId,
      pincode,
      area,
      description,
      state: getStateFromPincode(pincode),
      status,
      restoredAt: status === "restored" ? new Date() : null,
      reporterIpHash: ipHash,
    });

    const { reporterIpHash, ...safeReport } = report.toObject();
    res.status(201).json(safeReport);
  } catch (err) {
    next(err);
  }
}

async function getReportsByPincode(req, res, next) {
  try {
    const { pincode } = req.params;
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      return res.status(400).json({ message: "Invalid pincode format" });
    }

    const reports = await Report.find({ pincode }).sort({ createdAt: -1 }).limit(50);

    const latest = reports[0] || null;
    const currentStatus = latest ? latest.status : "no-recent-reports";

    res.json({
      pincode,
      state: getStateFromPincode(pincode),
      currentStatus,
      lastReportedAt: latest ? latest.createdAt : null,
      reports,
    });
  } catch (err) {
    next(err);
  }
}

async function getRecentReports(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const filter = req.query.status === "active" ? { status: { $in: ["reported", "ongoing"] } } : {};
    const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.json({ reports });
  } catch (err) {
    next(err);
  }
}

async function searchLocations(req, res, next) {
  try {
    const q = (req.query.q || "").toString().trim();
    if (q.length < 2) {
      return res.json({ results: [] });
    }

    const filter = /^[0-9]{1,6}$/.test(q)
      ? { pincode: { $regex: `^${q}` } }
      : { area: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } };

    const results = await Report.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$pincode",
          area: { $first: "$area" },
          state: { $first: "$state" },
          lastReportedAt: { $first: "$createdAt" },
        },
      },
      { $sort: { lastReportedAt: -1 } },
      { $limit: 20 },
      { $project: { _id: 0, pincode: "$_id", area: 1, state: 1, lastReportedAt: 1 } },
    ]);

    res.json({ results });
  } catch (err) {
    next(err);
  }
}

async function trackByReference(req, res, next) {
  try {
    const referenceId = (req.params.referenceId || "").trim().toUpperCase();
    const report = await Report.findOne({ referenceId });
    if (!report) {
      return res.status(404).json({ message: "No report found with that reference ID" });
    }
    const { reporterIpHash, ...safeReport } = report.toObject();
    res.json(safeReport);
  } catch (err) {
    next(err);
  }
}

async function confirmReport(req, res, next) {
  try {
    const { id } = req.params;
    const { type } = req.body; // "still_down" | "restored"

    if (!["still_down", "restored"].includes(type)) {
      return res.status(400).json({ message: "Invalid confirmation type" });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (type === "still_down") {
      report.confirmCount += 1;
      if (report.status === "reported") {
        report.status = "ongoing";
      }
    } else {
      report.restoredCount += 1;
      if (report.restoredCount >= RESTORED_CONFIRMATIONS_THRESHOLD && report.status !== "restored") {
        report.status = "restored";
        report.restoredAt = new Date();
      }
    }

    await report.save();
    const { reporterIpHash, ...safeReport } = report.toObject();
    res.json(safeReport);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReport,
  getReportsByPincode,
  getRecentReports,
  searchLocations,
  trackByReference,
  confirmReport,
};
