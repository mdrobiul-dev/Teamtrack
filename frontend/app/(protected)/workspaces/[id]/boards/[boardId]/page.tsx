import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/app/lib/auth";
import { boardService } from "@/app/services/board.service";
import { listService } from "@/app/services/list.service";
import { taskService } from "@/app/services/task.service";
import { workspaceService } from "@/app/services/workspace.service";
import { WorkspaceBoardPageClient } from "@/app/components/boards/workspace-board-page-client";
import type { Task } from "@/app/types/task";

export const metadata: Metadata = {
  title: "Board - TeamTrack",
  description: "Manage lists and tasks inside a workspace board",
};

export default async function WorkspaceBoardPage({
  params,
}: {
  params: Promise<{ id: string; boardId: string }>;
}) {
  await requireAuth();

  const { id, boardId } = await params;
  const [workspaces, boards, lists] = await Promise.all([
    workspaceService.getMyWorkspaces(),
    boardService.getBoardsByWorkspace(id),
    listService.getListsByBoard(boardId),
  ]);

  const workspace = workspaces.find((item) => item._id === id);
  const board = boards.find((item) => item._id === boardId);

  if (!workspace || !board || board.workspace !== id) {
    notFound();
  }

  const tasksByListEntries = await Promise.all(
    lists.map(async (list) => {
      const tasks = await taskService.getTasksByList(list._id);
      return [list._id, tasks] as const;
    }),
  );

  return (
    <WorkspaceBoardPageClient
      workspaceId={id}
      workspaceName={workspace.name}
      board={board}
      initialLists={lists}
      initialTasksByList={Object.fromEntries(tasksByListEntries) as Record<
        string,
        Task[]
      >}
    />
  );
}
