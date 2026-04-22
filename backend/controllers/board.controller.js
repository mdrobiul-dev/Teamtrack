const Activity = require("../models/Activity");
const Board = require("../models/Board");
const Workspace = require("../models/Workspace");

const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const workspaceId = req.params.workspaceId || req.body.workspaceId;

    if (!title || !workspaceId) {
      return res.status(400).json({ message: "Title and workspace required" });
    }

    const workspace = await Workspace.findById(workspaceId);

    const hasAccess =
      workspace &&
      (workspace.owner?.toString() === req.user.id ||
        workspace.members.some((m) => m.user?.toString() === req.user.id));

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const board = new Board({
      title,
      workspace: workspaceId,
      createdby: req.user.id,
    });

    await board.save();

    const activity = new Activity({
      user: req.user.id,
      action: "A Board has been created",
      entityType: "board",
      entityId: board._id,
      workspace: workspace._id,
    });

    await activity.save();

    res.status(201).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getBoards = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
    });

    const hasAccess =
      workspace &&
      (workspace.owner?.toString() === req.user.id ||
        workspace.members.some((m) => m.user?.toString() === req.user.id));

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const boards = await Board.find({
      workspace: workspaceId,
    });

    res.status(200).json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createBoard, getBoards };
