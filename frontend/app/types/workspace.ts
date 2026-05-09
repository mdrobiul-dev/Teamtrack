export interface WorkspaceMember {
  user: string;
  role: "admin" | "member";
  _id?: string;
}

export interface Workspace {
  _id: string;
  name: string;
  owner: string;
  members: WorkspaceMember[];
  boardCount?: number;
  listCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  _id: string;
  title: string;
  workspace: string;
  createdby: string;
  listCount?: number;
  taskCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  _id: string;
  title: string;
  board: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
