const express = require("express");
const protected = require("../middlewear/auth.middleware");
const {
  createList,
  getListsByBoard,
} = require("../controllers/list.controller");

const router = express.Router();

router.post("/", protected, createList);
router.get("/board/:boardId", protected, getListsByBoard);

module.exports = router 
