import type { Metadata } from "next";
import { WorkspaceStudioClient } from "@/app/components/workspace/workspace-studio-client";

export const metadata: Metadata = {
  title: "Workspaces",
  description: "Workspace, board, list, and task management",
};

export default function WorkspacesPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Workspaces</h1>
      <WorkspaceStudioClient />
    </div>
  );
}
