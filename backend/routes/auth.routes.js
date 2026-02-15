const express = require("express");
const { registerUser, loginUser, refreshAccessToken, getMe, logoutUser } = require("../controllers/auth.controller");
const protected = require("../middlewear/auth.middleware");
const { authLimiter } = require("../middlewear/authLimiter ");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",authLimiter, loginUser);
router.post("/refresh-token", refreshAccessToken); 

router.get("/me", protected, getMe);
router.post("/logout", protected, logoutUser);


module.exports = router;
