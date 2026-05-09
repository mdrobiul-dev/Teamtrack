import "server-only";
import { api } from "@/app/lib/api";
import type { Activity } from "@/app/types/activity";

export const activityService = {
  getWorkspaceActivity: async (workspaceId: string) => {
    return api.get<Activity[]>(`/activity/workspace/${workspaceId}`);
  },
};
