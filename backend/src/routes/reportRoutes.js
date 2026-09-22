const express = require("express");
const { body } = require("express-validator");
const {
  createReport,
  getReportsByPincode,
  getRecentReports,
  searchLocations,
  trackByReference,
  confirmReport,
} = require("../controllers/reportController");
const { reportLimiter, actionLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post(
  "/",
  reportLimiter,
  [
    body("pincode")
      .isString()
      .matches(/^[1-9][0-9]{5}$/)
      .withMessage("Pincode must be a valid 6-digit Indian PIN code"),
    body("area").optional().isString().isLength({ max: 120 }),
    body("description").optional().isString().isLength({ max: 500 }),
    body("status").optional().isIn(["reported", "restored"]).withMessage("Invalid status"),
  ],
  createReport
);

router.get("/recent", getRecentReports);
router.get("/search", searchLocations);
router.get("/track/:referenceId", trackByReference);
router.get("/pincode/:pincode", getReportsByPincode);
router.post("/:id/confirm", actionLimiter, confirmReport);

module.exports = router;
