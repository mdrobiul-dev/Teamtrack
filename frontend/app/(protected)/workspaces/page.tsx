import { Metadata } from "next";
import { Suspense } from "react";
import { requireAuth } from "@/app/lib/auth";
import { workspaceService } from "@/app/services/workspace.service";
import { WorkspaceClient } from "@/app/components/workspace/workspace-client";
import { CreateWorkspaceForm } from "@/app/components/workspace/create-workspace-form";

export const metadata: Metadata = {
  title: "Workspaces - TeamTrack",
  description: "Manage your workspaces",
};

export default async function WorkspacesPage() {
  const session = await requireAuth();
  const workspaces = await workspaceService.getMyWorkspaces();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-800 tracking-tight">
          My Workspaces
        </h1>
        <p className="mt-2 text-primary-500">
          Build, organize, and scale your team's productivity flows
        </p>
      </div>

      {/* Create Workspace Form - Client Component using Server Action */}
      <CreateWorkspaceForm />

      {/* Workspace Grid */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-primary-50 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        }
      >
        <WorkspaceClient workspaces={workspaces} />
      </Suspense>
    </div>
  );
}