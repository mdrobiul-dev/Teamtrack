// Simple server-side store for workspaces.
// In a real app, this would be a database (e.g., Prisma, Drizzle, etc.)
const workspaces = new Map();

export function getWorkspaces() {
  return Array.from(workspaces.values());
}

export function addWorkspace(name) {
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  const workspace = { id, name, createdAt: new Date().toISOString() };
  workspaces.set(id, workspace);
  return workspace;
}