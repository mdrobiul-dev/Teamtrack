const Activity = require("../models/Activity");
const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");

const deleteBoardChildren = async (boardId) => {
  const lists = await List.find({ board: boardId }).select("_id");
  const listIds = lists.map((list) => list._id);

  const taskDeleteResult = await Task.deleteMany({ list: { $in: listIds } });
  const listDeleteResult = await List.deleteMany({ board: boardId });

  return {
    deletedLists: listDeleteResult.deletedCount || 0,
    deletedTasks: taskDeleteResult.deletedCount || 0,
  };
};

const deleteWorkspaceChildren = async (workspaceId) => {
  const boards = await Board.find({ workspace: workspaceId }).select("_id");
  const boardIds = boards.map((board) => board._id);
  const lists = await List.find({ board: { $in: boardIds } }).select("_id");
  const listIds = lists.map((list) => list._id);

  const taskDeleteResult = await Task.deleteMany({ list: { $in: listIds } });
  const listDeleteResult = await List.deleteMany({ board: { $in: boardIds } });
  const boardDeleteResult = await Board.deleteMany({ workspace: workspaceId });
  const activityDeleteResult = await Activity.deleteMany({
    workspace: workspaceId,
  });

  return {
    deletedBoards: boardDeleteResult.deletedCount || 0,
    deletedLists: listDeleteResult.deletedCount || 0,
    deletedTasks: taskDeleteResult.deletedCount || 0,
    deletedActivities: activityDeleteResult.deletedCount || 0,
  };
};

module.exports = {
  deleteBoardChildren,
  deleteWorkspaceChildren,
};
