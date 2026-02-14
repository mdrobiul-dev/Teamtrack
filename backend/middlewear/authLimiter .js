// Prevent Brute Force by adding limit

const rateLimit = require("express-rate-limit")

const authLimiter = rateLimit({
    windowMs : 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
  message: {
    message: "Too many login attempts, please try again later"
  }
})

module.exports = {authLimiter}