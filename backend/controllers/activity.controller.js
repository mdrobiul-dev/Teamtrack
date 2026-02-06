const Activity = require("../models/Activity");

const getWorkspaceActivity = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const activities = await Activity.find({ workspace: workspaceId })
      .populate("user", "name")
      .sort("-createdAt")
      .limit(20);

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getWorkspaceActivity };
