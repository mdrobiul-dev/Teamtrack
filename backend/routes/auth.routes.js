const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { authLimiter } = require("../middlewear/authLimiter ");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",authLimiter, loginUser);

module.exports = router;
