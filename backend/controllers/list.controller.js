const Board = require("../models/Board");
const List = require("../models/List");

const createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;

    if (!title || !boardId) {
      return res.status(400).json({ message: "Title and boardId required" });
    }

    const board = await Board.findById(boardId).populate("workspace");

    if (!board || !board.workspace.members.includes(req.user.id)) {
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

    if (!board || !board.workspace.members.includes(req.user.id)) {
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

module.exports = { createList, getListsByBoard, reorderLists };
