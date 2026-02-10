const express = require("express");
const {
  createTask,
  getTasksByList,
  reorderTasks,
  moveTask,
  assignTask,
  deleteTask,
  unassignTask,
  getTaskById,
} = require("../controllers/task.controller");
const protected = require("../middlewear/auth.middleware");
const validateTask = require("../middlewear/validateTask");

const router = express.Router();

router.post("/", protected, validateTask, createTask);
router.get("/:taskId", protected, getTaskById);
router.put("/:taskId/assign", protected, assignTask);
router.put("/reorder", protected, reorderTasks);
router.put("/:taskId/move", protected, moveTask);
router.get("/list/:listId", protected, getTasksByList);
router.delete("/:taskId", protected, deleteTask);
router.put("/:taskId/unassign", protected, unassignTask);


module.exports = router;
