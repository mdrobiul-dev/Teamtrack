const Activity = require("../models/Activity");
const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");

const createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;

    if (!title || !boardId) {
      return res.status(400).json({ message: "Title and boardId required" });
    }

    const board = await Board.findById(boardId).populate("workspace");

    const hasAccess =
      board &&
      board.workspace &&
      (board.workspace.owner?.toString() === req.user.id ||
        board.workspace.members.some((m) => m.user?.toString() === req.user.id));

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const lastList = await List.findOne({ board: boardId }).sort("-order");

    const newOrder = lastList ? lastList.order + 1 : 1;

    const list = new List({
      title,
      board: boardId,
      order: newOrder,
    });

    await list.save();

    const activity = new Activity({
      user: req.user.id,
      action: "A list has been created",
      entityType: "list",
      entityId: list._id,
      workspace: board.workspace._id,
    });

    await activity.save();

    res.status(201).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getListsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await Board.findById(boardId).populate("workspace");

    const hasAccess =
      board &&
      board.workspace &&
      (board.workspace.owner?.toString() === req.user.id ||
        board.workspace.members.some((m) => m.user?.toString() === req.user.id));

    if (!hasAccess) {
      return res.status(400).json({ message: "Access denied" });
    }

    const list = await List.find({ board: boardId }).sort("order");

    res.status(200).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const reorderLists = async (req, res) => {
  try {
    const { items } = req.body;

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await List.bulkWrite(bulkOps);
    res.status(200).json({ message: "Lists reordered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteList = async (req, res) => {
  try {
    const { listId } = req.params;

    const list = await List.findById(listId).populate({
      path: "board",
      populate: { path: "workspace" },
    });

    if (!list || !list.board || !list.board.workspace) {
      return res.status(404).json({ message: "List not found" });
    }

    const workspace = list.board.workspace;
    const hasAccess =
      workspace.owner?.toString() === req.user.id ||
      workspace.members.some((m) => m.user?.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Task.deleteMany({ list: listId });
    await List.findByIdAndDelete(listId);
    await List.updateMany(
      { board: list.board._id, order: { $gt: list.order } },
      { $inc: { order: -1 } },
    );

    await Activity.create({
      user: req.user.id,
      action: "A list has been deleted",
      entityType: "list",
      entityId: list._id,
      workspace: workspace._id,
    });

    res.json({ message: "List deleted successfully", listId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createList, getListsByBoard, reorderLists, deleteList };
