const express = require("express");
const { listUpcomingMaintenance } = require("../controllers/maintenanceController");

const router = express.Router();

router.get("/", listUpcomingMaintenance);

module.exports = router;
