const Workspace = require("../models/Workspace");

const requireWorkspaceAdmin = async (req, res, next) => {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    return res.status(404).json({ message: "Workspace not found" });
  }

  const isAdmin =
    workspace.owner?.toString() === req.user.id ||
    workspace.members.some(
      (m) => m.user?.toString() === req.user.id && m.role === "admin",
    );

  if (!isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  req.workspace = workspace;
  next();
};

module.exports = requireWorkspaceAdmin
