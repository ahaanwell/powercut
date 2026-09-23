const express = require("express");
const {
  getLocalities,
  getNearby,
  getGeocode,
  getReverseGeocode,
  getGridStatus,
  getAllPincodes,
} = require("../controllers/pincodeController");

const router = express.Router();

router.get("/grid", getGridStatus);
router.get("/reverse", getReverseGeocode);
router.get("/all", getAllPincodes);
router.get("/:pincode/localities", getLocalities);
router.get("/:pincode/nearby", getNearby);
router.get("/:pincode/geocode", getGeocode);

module.exports = router;
