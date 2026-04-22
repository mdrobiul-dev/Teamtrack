import "server-only";
import { api } from "@/app/lib/api";
import type {
  AssignTaskPayload,
  BoardOption,
  CreateTaskPayload,
  ListOption,
  MoveTaskPayload,
  ReorderTasksPayload,
  Task,
  WorkspaceOption,
} from "@/app/types/task";

type MessageResponse = {
  message: string;
};

export const taskService = {
  createTask: async (payload: CreateTaskPayload) => {
    return api.post<Task>("/tasks", payload);
  },

  getTaskById: async (taskId: string) => {
    return api.get<Task>(`/tasks/${taskId}`);
  },

  getTasksByList: async (listId: string) => {
    return api.get<Task[]>(`/tasks/list/${listId}`);
  },

  getWorkspaces: async () => {
    return api.get<WorkspaceOption[]>("/workspaces");
  },

  getBoardsByWorkspace: async (workspaceId: string) => {
    return api.get<BoardOption[]>(`/boards/workspace/${workspaceId}`);
  },

  getListsByBoard: async (boardId: string) => {
    return api.get<ListOption[]>(`/lists/board/${boardId}`);
  },

  assignTask: async (taskId: string, payload: AssignTaskPayload) => {
    return api.put<{ message: string; task: Task }>(
      `/tasks/${taskId}/assign`,
      payload,
    );
  },

  unassignTask: async (taskId: string) => {
    return api.put<{ message: string; task: Task }>(`/tasks/${taskId}/unassign`);
  },

  moveTask: async (taskId: string, payload: MoveTaskPayload) => {
    return api.put<{ message: string; task: Task }>(`/tasks/${taskId}/move`, payload);
  },

  reorderTasks: async (payload: ReorderTasksPayload) => {
    return api.put<MessageResponse>("/tasks/reorder", payload);
  },

  deleteTask: async (taskId: string) => {
    return api.delete<MessageResponse>(`/tasks/${taskId}`);
  },
};
