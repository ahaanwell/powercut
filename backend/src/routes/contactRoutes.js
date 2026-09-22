const express = require("express");
const { createContactMessage } = require("../controllers/contactController");
const { reportLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/", reportLimiter, createContactMessage);

module.exports = router;
