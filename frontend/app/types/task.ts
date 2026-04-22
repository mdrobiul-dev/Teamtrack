export interface AssignedUser {
  _id: string;
  name: string;
  email: string;
}

export interface WorkspaceOption {
  _id: string;
  name: string;
}

export interface BoardOption {
  _id: string;
  title: string;
  workspace: string;
}

export interface ListOption {
  _id: string;
  title: string;
  board: string;
  order: number;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  list: string;
  assignedTo: string | AssignedUser | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  listId: string;
}

export interface MoveTaskPayload {
  targetListId: string;
}

export interface AssignTaskPayload {
  userId: string;
}

export interface ReorderTaskItem {
  id: string;
  order: number;
}

export interface ReorderTasksPayload {
  listId: string;
  items: ReorderTaskItem[];
}
