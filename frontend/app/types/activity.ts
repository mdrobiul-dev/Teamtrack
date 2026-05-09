export type ActivityEntityType = "workspace" | "board" | "list" | "task";

export interface ActivityUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
}

export interface Activity {
  _id: string;
  user: string | ActivityUser;
  action: string;
  entityType: ActivityEntityType | string;
  entityId: string;
  workspace: string;
  createdAt: string;
  updatedAt: string;
}
