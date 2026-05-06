"use client";

import { WorkspaceCard } from "@/app/components/workspace/workspace-card";
import type { Workspace } from "@/app/types/workspace";
import { FolderOpen } from "lucide-react";

interface WorkspaceClientProps {
  workspaces: Workspace[];
}

export function WorkspaceClient({ workspaces }: WorkspaceClientProps) {
  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-primary-200">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FolderOpen className="w-8 h-8 text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-primary-800 mb-2">
          No workspaces yet
        </h3>
        <p className="text-primary-400 max-w-md mx-auto">
          Create your first workspace above to start organizing your team's
          projects and tasks efficiently.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace._id} workspace={workspace} />
      ))}
    </div>
  );
}
