const express = require("express");
const {
  createTask,
  getTasksByList,
} = require("../controllers/task.controller");
const protected = require("../middlewear/auth.middleware");

const router = express.Router();

router.post("/", protected, createTask);
router.get("/list/:listId", protected, getTasksByList);

module.exports = router;
