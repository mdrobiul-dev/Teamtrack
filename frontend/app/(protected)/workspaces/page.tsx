// app/workspaces/page.tsx
import { Metadata } from "next";
import { requireAuth } from "@/app/lib/auth";
import { boardService } from "@/app/services/board.service";
import { listService } from "@/app/services/list.service";
import { workspaceService } from "@/app/services/workspace.service";
import { WorkspacePageDetails } from "@/app/components/workspace/workspace-page-details";

export const metadata: Metadata = {
  title: "Workspaces - TeamTrack",
  description: "Manage your workspaces",
};

export default async function WorkspacesPage() {
  await requireAuth();
  const workspaces = await workspaceService.getMyWorkspaces();
  const workspacesWithCounts = await Promise.all(
    workspaces.map(async (workspace) => {
      const boards = await boardService.getBoardsByWorkspace(workspace._id);
      const listsByBoard = await Promise.all(
        boards.map((board) => listService.getListsByBoard(board._id)),
      );

      return {
        ...workspace,
        boardCount: boards.length,
        listCount: listsByBoard.reduce((total, lists) => total + lists.length, 0),
      };
    }),
  );

  return <WorkspacePageDetails initialWorkspaces={workspacesWithCounts} />;
}
