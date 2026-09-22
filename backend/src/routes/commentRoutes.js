const express = require("express");
const { createComment, getRecentComments } = require("../controllers/commentController");
const { actionLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/", actionLimiter, createComment);
router.get("/pincode/:pincode", getRecentComments);

module.exports = router;
