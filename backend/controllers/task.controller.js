const List = require("../models/List");
const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, listId } = req.body;

    if (!title || !listId) {
      return res.status(400).json({ message: "Title and listId required" });
    }

    const list = await List.findById(listId).populate({
      path: "board",
      populate: { path: "workspace" },
    });

    if (!list || !list.board.workspace.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const task = new Task({
      title,
      description,
      list: listId,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTasksByList = async (req, res) => {
  try {
    const { listId } = req.params;

    const list = await List.findById(listId).populate({
      path: "board",
      populate: { path: "workspace" },
    });

    if (!list || !list.board.workspace.members.include(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ list: listId }).sort("order");

    res.json(tasks);
  } catch (error) {}
};

module.exports = { createTask, getTasksByList };
