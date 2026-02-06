const express = require("express");
const protected = require("../middlewear/auth.middleware");
const { createWorkspace, getMyWorkspaces } = require("../controllers/workspace.controller");

const router = express.Router();

router.post("/", protected, createWorkspace);
// router.post("/workspaces/:workspaceId/members")
router.get("/", protected, getMyWorkspaces);

module.exports = router
