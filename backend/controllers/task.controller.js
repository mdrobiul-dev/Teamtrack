const Activity = require("../models/Activity");
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

    const lastTask = await List.findOne({ list: listId }).sort("-order");

    const newOrder = lastTask ? lastTask.order + 1 : 1;

    const task = new Task({
      title,
      description,
      list: listId,
      order: newOrder,
    });

    await task.save();

    const activity = new Activity({
      user: req.user.id,
      action: "A task has been created",
      entityType: "task",
      entityId: task._id,
      workspace: list.board.workspace._id,
    });

    await activity.save();

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

    if (!list || !list.board.workspace.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ list: listId }).sort("order");

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const reorderTasks = async (req, res) => {
  try {
    const { items } = req.body;

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Task.bulkWrite(bulkOps);

    res.status(200).json({
      message: "Tasks reordered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const moveTask = async (req, res) => {
  try {
    const { taskId, targetListId } = req.body;

    if (!taskId || !targetListId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const task = await Task.findById(taskId).populate({
      path: "list",
      populate: {
        path: "board",
        populate: { path: "workspace" },
      },
    });

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    const workspaceId = task.list.board.workspace._id;

    const lastTask = await Task.findOne({ list: targetListId }).sort("-order");
    const newOrder = lastTask ? lastTask.order + 1 : 1;

    task.list = targetListId;
    task.order = newOrder;

    await task.save();

    await Activity.create({
      user: req.user.id,
      action: "A task has been moved",
      entityType: "task",
      entityId: task._id,
      workspace: workspaceId,
    });

    res.status(200).json({ message: "Task moved successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createTask, getTasksByList, reorderTasks, moveTask };
