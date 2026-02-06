const Workspace = require("../models/Workspace");

const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name required" });
    }

    const workspace = new Workspace({
      name,
      owner: req.user.id,
      members: [
        {
          user: req.user.id,
          role: "admin",
        },
      ],
    });
    await workspace.save();

    res.status(200).json({
      message: "Workspace created",
      workspace,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ members: req.user.id });

    res.status(200).json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createWorkspace, getMyWorkspaces };
