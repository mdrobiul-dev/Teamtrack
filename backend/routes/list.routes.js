const express = require("express");
const protected = require("../middlewear/auth.middleware");
const {
  createList,
  deleteList,
  getListsByBoard,
  reorderLists,
} = require("../controllers/list.controller");

const router = express.Router();

router.post("/", protected, createList);
router.put("/reorder", protected, reorderLists)
router.get("/board/:boardId", protected, getListsByBoard);
router.delete("/:listId", protected, deleteList);

module.exports = router;
