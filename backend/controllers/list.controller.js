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

    const list = new List({
      title,
      board: boardId,
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

    const board = await Board.findById(boardId).populate("Workspace");

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

module.exports = { createList, getListsByBoard };
