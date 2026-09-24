const express = require("express");
const {
  getOverallStats,
  listStates,
  getStateDetail,
  getStateDistrictDetail,
  getPincodeScore,
  getPincodeTrend,
} = require("../controllers/statsController");

const router = express.Router();

router.get("/", getOverallStats);
router.get("/states", listStates);
router.get("/states/:slug", getStateDetail);
router.get("/states/:slug/districts/:districtSlug", getStateDistrictDetail);
router.get("/pincode/:pincode/score", getPincodeScore);
router.get("/pincode/:pincode/trend", getPincodeTrend);

module.exports = router;
