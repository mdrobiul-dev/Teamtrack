const express = require("express");
const protected = require("../middlewear/auth.middleware");
const { createBoard, getBoards } = require("../controllers/board.controller");
const requireWorkspaceAdmin = require("../middlewear/workspaceRole.middleware");

const router = express.Router();

router.post("/:workspaceId", protected, requireWorkspaceAdmin, createBoard);
router.get("/workspace/:workspaceId", protected, getBoards);

module.exports = router;
