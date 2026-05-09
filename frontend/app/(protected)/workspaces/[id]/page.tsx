import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/app/lib/auth";
import { boardService } from "@/app/services/board.service";
import { listService } from "@/app/services/list.service";
import { taskService } from "@/app/services/task.service";
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

  const boardsWithCounts = await Promise.all(
    boards.map(async (board) => {
      const lists = await listService.getListsByBoard(board._id);
      const tasksByList = await Promise.all(
        lists.map((list) => taskService.getTasksByList(list._id)),
      );

      return {
        ...board,
        listCount: lists.length,
        taskCount: tasksByList.reduce((total, tasks) => total + tasks.length, 0),
      };
    }),
  );

  return (
    <BoardListingPageClient
      workspaceId={id}
      workspaceName={workspace.name}
      initialBoards={boardsWithCounts}
    />
  );
}
