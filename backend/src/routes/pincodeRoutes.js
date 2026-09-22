const express = require("express");
const { getLocalities, getNearby, getGeocode, getGridStatus } = require("../controllers/pincodeController");

const router = express.Router();

router.get("/grid", getGridStatus);
router.get("/:pincode/localities", getLocalities);
router.get("/:pincode/nearby", getNearby);
router.get("/:pincode/geocode", getGeocode);

module.exports = router;
