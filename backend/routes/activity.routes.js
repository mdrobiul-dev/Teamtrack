const express = require("express")
const { getWorkspaceActivity } = require("../controllers/activity.controller")
const protected = require("../middlewear/auth.middleware");

const router = express.Router()

router.get("/workspace/:workspaceId", protected, getWorkspaceActivity)

module.exports = router