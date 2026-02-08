const Workspace = require("../models/Workspace");

const checkWorkspaceAccess = async (workspaceId, userId) => {
  try {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return { access: false, role: null };
    }

    const isOwner = workspace.owner.toString() === userId.toString();

    const member = workspace.members.find(
      (m) => m.user?.toString() === userId.toString(),
    );

    return {
        access : isOwner || !!member,
        role : isOwner ? "owner" : (member ? member.role : null),
        isAdmin : isOwner || (member && member.role === "admin")
    }

  } catch (error) {
    return {access : false , role : null, isAdmin : false}
  }
};

module.exports = {checkWorkspaceAccess}
