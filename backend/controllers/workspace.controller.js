const Activity = require("../models/Activity");
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

    const activity = new Activity({
      user: req.user.id,
      action: "A workspace has been created",
      entityType: "workspace",
      entityId: workspace._id,
      workspace: workspace._id,
    });

    await activity.save();

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

const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(400).json({ message: "Workspace not found" });
    }

    const isAdmin =
      workspace.owner.toString() === req.user.id ||
      workspace.members.some(
        (m) => m.user.toString === req.user.id && m.role === "admin",
      );

    if (!isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const alreadyMember = workspace.members.some(
      (m) => m.user?.toString() === userId,
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User already a member" });
    }

    workspace.members.push({ user: userId });

    await workspace.save();

       const activity = new Activity({
      user: req.user.id,
      action: "A member has been added to workspace",
      entityType: "workspace",
      entityId: workspace._id,
      workspace: workspace._id,
    });

    await activity.save();

    res.json({ message: "Member added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createWorkspace, getMyWorkspaces, addMember };
