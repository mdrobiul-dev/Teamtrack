import "server-only";
import { api } from "@/app/lib/api";
import type { List } from "@/app/types/workspace";

export const listService = {
  getListsByBoard: async (boardId: string) => {
    return api.get<List[]>(`/lists/board/${boardId}`);
  },

  createList: async (boardId: string, title: string) => {
    return api.post<List>("/lists", { boardId, title });
  },

  deleteList: async (listId: string) => {
    return api.delete<{ message: string; listId: string }>(`/lists/${listId}`);
  },

  reorderLists: async (items: { id: string; order: number }[]) => {
    return api.put<{ message: string }>("/lists/reorder", { items });
  },
};
