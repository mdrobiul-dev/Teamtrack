const express = require("express");
const protected = require("../middlewear/auth.middleware");
const { createBoard, getBoards, deleteBoard } = require("../controllers/board.controller");
const requireWorkspaceAdmin = require("../middlewear/workspaceRole.middleware");

const router = express.Router();

router.post("/:workspaceId", protected, requireWorkspaceAdmin, createBoard);
router.get("/workspace/:workspaceId", protected, getBoards);
router.delete("/:workspaceId/boards/:boardId", protected, deleteBoard);

module.exports = router;
