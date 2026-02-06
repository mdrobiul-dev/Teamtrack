const express = require("express");
const {
  createTask,
  getTasksByList,
  reorderTasks,
  moveTask,
} = require("../controllers/task.controller");
const protected = require("../middlewear/auth.middleware");

const router = express.Router();

router.post("/", protected, createTask);
router.put("/reorder", protected, reorderTasks);
router.put("/move", protected, moveTask)
router.get("/list/:listId", protected, getTasksByList);

module.exports = router;
