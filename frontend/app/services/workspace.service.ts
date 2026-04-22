import "server-only";
import { api } from "@/app/lib/api";
import type { Workspace } from "@/app/types/workspace";

export const workspaceService = {
  getMyWorkspaces: async () => {
    return api.get<Workspace[]>("/workspaces");
  },

  createWorkspace: async (name: string) => {
    return api.post<{ message: string; workspace: Workspace }>("/workspaces", {
      name,
    });
  },
};
