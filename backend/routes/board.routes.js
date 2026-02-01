const express = require("express");
const protected = require("../middlewear/auth.middleware");
const { createBoard, getBoards } = require("../controllers/board.controller");

const router = express.Router();

router.post("/", protected, createBoard);
router.get("/workspace/:workspaceId", protected, getBoards);

module.exports = router;
