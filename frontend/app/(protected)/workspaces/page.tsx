// app/workspaces/page.tsx
import { Metadata } from "next";
import { requireAuth } from "@/app/lib/auth";
import { workspaceService } from "@/app/services/workspace.service";
import { WorkspacePageClient } from "@/app/components/workspace/workspace-page-client";

export const metadata: Metadata = {
  title: "Workspaces - TeamTrack",
  description: "Manage your workspaces",
};

export default async function WorkspacesPage() {
  const session = await requireAuth();
  const workspaces = await workspaceService.getMyWorkspaces();

  return <WorkspacePageClient initialWorkspaces={workspaces} />;
}
