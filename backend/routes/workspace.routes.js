const express = require("express");
const protected = require("../middlewear/auth.middleware");
const {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  addMember,
  deleteWorkspace,
} = require("../controllers/workspace.controller");
const requireWorkspaceAdmin = require("../middlewear/workspaceRole.middleware");

const router = express.Router();

router.post("/", protected, createWorkspace);

router.post(
  "/:workspaceId/members",
  protected,
  requireWorkspaceAdmin,
  addMember,
);
router.get("/", protected, getMyWorkspaces);
router.get("/:workspaceId", protected, getWorkspaceById);
router.delete("/:workspaceId", protected, requireWorkspaceAdmin, deleteWorkspace);

module.exports = router;
