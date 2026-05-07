import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/app/lib/auth";
import { boardService } from "@/app/services/board.service";
import { workspaceService } from "@/app/services/workspace.service";
import { BoardListingPageClient } from "@/app/components/boards/board-listing-page-client";

export const metadata: Metadata = {
  title: "Workspace Boards - TeamTrack",
  description: "Manage boards inside your workspace",
};

export default async function WorkspaceBoardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();

  const { id } = await params;
  const [workspaces, boards] = await Promise.all([
    workspaceService.getMyWorkspaces(),
    boardService.getBoardsByWorkspace(id),
  ]);
  const workspace = workspaces.find((item) => item._id === id);

  if (!workspace) {
    notFound();
  }

  return (
    <BoardListingPageClient
      workspaceId={id}
      workspaceName={workspace.name}
      initialBoards={boards}
    />
  );
}
