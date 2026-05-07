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

const deleteBoard = async (req, res) => {
  try {
    const { workspaceId, boardId } = req.params;
    const userId = req.user.id;

    if (!workspaceId || !boardId) {
      return res.status(400).json({ 
        message: "Workspace ID and Board ID are required" 
      });
    }

    // Find the board and populate workspace
    const board = await Board.findById(boardId).populate("workspace");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Extra security: Ensure the board actually belongs to this workspace
    if (board.workspace._id.toString() !== workspaceId) {
      return res.status(400).json({ 
        message: "Board does not belong to this workspace" 
      });
    }

    const workspace = board.workspace;

    // Permission check: Only owner or admin can delete
    const hasAccess =
      workspace &&
      (workspace.owner?.toString() === userId ||
        workspace.members.some(
          (m) => m.user?.toString() === userId && m.role === "admin"
        ));

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied. Only workspace admins can delete boards.",
      });
    }

    // Delete the board
    await Board.findByIdAndDelete(boardId);

    // Log activity
    const activity = new Activity({
      user: userId,
      action: "A Board has been deleted",
      entityType: "board",
      entityId: board._id,
      workspace: workspace._id,
    });

    await activity.save();

    res.status(200).json({
      message: "Board deleted successfully",
      boardId: board._id,
    });
  } catch (error) {
    console.error("Delete Board Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createBoard, getBoards, deleteBoard };
