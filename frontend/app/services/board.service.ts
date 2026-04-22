import "server-only";
import { api } from "@/app/lib/api";
import type { Board } from "@/app/types/workspace";

export const boardService = {
  getBoardsByWorkspace: async (workspaceId: string) => {
    return api.get<Board[]>(`/boards/workspace/${workspaceId}`);
  },

  createBoard: async (workspaceId: string, title: string) => {
    return api.post<Board>(`/boards/${workspaceId}`, { title, workspaceId });
  },
};
