const express = require("express");
const {
  createTask,
  getTasksByList,
  reorderTasks,
  moveTask,
  assignTask,
} = require("../controllers/task.controller");
const protected = require("../middlewear/auth.middleware");
const requireWorkspaceAdmin = require("../middlewear/workspaceRole.middleware");

const router = express.Router();

router.post("/", protected, createTask);
// PUT /api/tasks/:taskId/assign
router.put("/:taskId/assign",protected, assignTask )
router.put("/reorder", protected, reorderTasks);
router.put("/:taskId/move", protected, moveTask);
router.get("/list/:listId", protected, getTasksByList);

module.exports = router;
