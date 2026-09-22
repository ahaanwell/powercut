const express = require("express");
const { listDistricts, getDistrictDetail } = require("../controllers/districtController");

const router = express.Router();

router.get("/", listDistricts);
router.get("/:slug", getDistrictDetail);

module.exports = router;
