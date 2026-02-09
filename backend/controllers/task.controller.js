const { checkWorkspaceAccess } = require("../helpers/checkWorkspaceAccess ");
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

    if (!list || !list.board || list.board.workspace) {
      return res
        .status(404)
        .json({ message: "List, board, or workspace not found" });
    }

    const { access } = await checkWorkspaceAccess(
      list.board.workspace._id,
      req.user.id,
    );

    if (!access) {
      return res.status(403).json({ message: "Access denied" });
    }

    const lastTask = await Task.findOne({ list: listId }).sort("-order");

    const newOrder = lastTask ? lastTask.order + 1 : 1;

    const task = new Task({
      title: title.trim(),
      description: description?.trim(),
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

    const { access } = await checkWorkspaceAccess(
      list.board.workspace._id,
      req.user.id,
    );

    if (!access) {
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
    const { items, listId } = req.body;

    if (!listId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "listId and non-empty items array required",
      });
    }

    const list = await List.findById(listId).populate({
      path: "board",
      populate: { path: "workspace" },
    });

    if (!list || !list.board || !list.board.workspace) {
      return res.status(404).json({
        message: "List, board, or workspace not found",
      });
    }

    const { access } = await checkWorkspaceAccess(
      list.board.workspace._id,
      req.user.id,
    );

    if (!access) {
      return res.status(403).json({ message: "Access denied" });
    }

    const taskIds = items.map((item) => item.id);

    const tasks = await Task.find({
      _id: { $in: taskIds },
      list: listId,
    });

    if (tasks.length !== taskIds.length) {
      return res.status(400).json({
        message: "Some tasks not found or don't belong to this list",
      });
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Task.bulkWrite(bulkOps);

    res.status(200).json({ message: "Tasks reordered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { targetListId } = req.body;

    if (!taskId || !targetListId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(targetListId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const task = await Task.findById(taskId).populate({
      path: "list",
      populate: {
        path: "board",
        populate: { path: "workspace" },
      },
    });

    if (!task || !task.list?.board || !task.list?.board?.workspace) {
      return res
        .status(404)
        .json({ message: "Task or related workspace not found" });
    }

    const sourceWorkspaceId = task.list.board.workspace._id;

    const { access: sourceAccess } = await checkWorkspaceAccess(
      sourceWorkspaceId,
      req.user.id,
    );

    if (!sourceAccess) {
      return res
        .status(403)
        .json({ message: "Access denied to source workspace" });
    }

    const targetList = await List.findById(targetListId).populate({
      path: "board",
      populate: { path: "workspace" },
    });

    if (!targetList || !targetList.board || !targetList.board.workspace) {
      return res.status(404).json({ message: "Target list not found" });
    }

    const targetWorkspaceId = targetList.board.workspace._id;

    if (sourceWorkspaceId.toString() !== targetWorkspaceId.toString()) {
      return res.status(400).json({
        message: "Cannot move task between different workspaces",
      });
    }

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
      workspace: sourceWorkspaceId,
    });

    res.status(200).json({ message: "Task moved successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const task = await Task.findById(taskId).populate({
      path: "list",
      populate: { path: "board", populate: { path: "workspace" } },
    });

    if (!task || !task.list?.board || !task.list?.board?.workspace) {
      return res.status(404).json({ message: "Task not found" });
    }

    const workspace = task.list?.board?.workspace;

    const { isAdmin } = await checkWorkspaceAccess(workspace._id, req.user.id);

    if (!isAdmin) {
      return res.status(403).json({
        message: "Only workspace admins can assign tasks",
      });
    }

    const { access: targetUserAccess } = await checkWorkspaceAccess(
      workspace._id,
      userId,
    );

    if (!targetUserAccess) {
      return res
        .status(403)
        .json({ message: "User is not a workspace member" });
    }

    if (task.assignedTo?.toString() === userId) {
      return res.status(400).json({
        message: "Task is already assigned to this user",
      });
    }

    task.assignedTo = userId;
    await task.save();

    await Activity.create({
      user: req.user.id,
      action: "assigned a task",
      entityType: "task",
      entityId: task._id,
      workspace: workspace._id,
    });

    res.json({
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  getTasksByList,
  reorderTasks,
  moveTask,
  assignTask,
};                                      
