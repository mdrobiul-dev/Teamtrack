import type { Metadata } from "next";
import { requireAuth } from "@/app/lib/auth";
import { boardService } from "@/app/services/board.service";
import { listService } from "@/app/services/list.service";
import { taskService } from "@/app/services/task.service";
import { workspaceService } from "@/app/services/workspace.service";
import { DashboardClient } from "@/app/components/dashboard/dashboard-client";
import type { DashboardBoard, DashboardTask } from "@/app/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard - TeamTrack",
  description: "Your TeamTrack dashboard",
};

export default async function DashboardPage() {
  const session = await requireAuth();
  const workspaces = await workspaceService.getMyWorkspaces();

  const workspaceGroups = await Promise.all(
    workspaces.map(async (workspace) => {
      const boards = await boardService.getBoardsByWorkspace(workspace._id);
      const boardsWithCounts = await Promise.all(
        boards.map(async (board) => {
          const lists = await listService.getListsByBoard(board._id);
          const tasksByList = await Promise.all(
            lists.map(async (list) => ({
              list,
              tasks: await taskService.getTasksByList(list._id),
            })),
          );

          return {
            ...board,
            workspaceId: workspace._id,
            workspaceName: workspace.name,
            listCount: lists.length,
            taskCount: tasksByList.reduce(
              (total, item) => total + item.tasks.length,
              0,
            ),
            tasksByList,
          };
        }),
      );

      return { workspace, boards: boardsWithCounts };
    }),
  );

  const boards: DashboardBoard[] = workspaceGroups
    .flatMap(({ boards }) =>
      boards.map((board) => ({
        _id: board._id,
        title: board.title,
        workspaceId: board.workspaceId,
        workspaceName: board.workspaceName,
        listCount: board.listCount,
        taskCount: board.taskCount,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  const tasks: DashboardTask[] = workspaceGroups
    .flatMap(({ boards }) =>
      boards.flatMap((board) =>
        board.tasksByList.flatMap(({ list, tasks }) =>
          tasks.map((task) => ({
            _id: task._id,
            title: task.title,
            listId: list._id,
            listTitle: list.title,
            boardId: board._id,
            boardTitle: board.title,
            workspaceId: board.workspaceId,
            workspaceName: board.workspaceName,
            assignedTo: task.assignedTo,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          })),
        ),
      ),
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  const memberIds = new Set<string>();
  workspaces.forEach((workspace) => {
    memberIds.add(workspace.owner);
    workspace.members?.forEach((member) => memberIds.add(member.user));
  });

  return (
    <DashboardClient
      user={session}
      stats={{
        workspaces: workspaces.length,
        boards: boards.length,
        lists: boards.reduce((total, board) => total + board.listCount, 0),
        tasks: tasks.length,
        members: memberIds.size,
      }}
      recentWorkspaces={workspaces
        .slice()
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 4)
        .map((workspace) => ({
          _id: workspace._id,
          name: workspace.name,
          boardCount:
            workspaceGroups.find((group) => group.workspace._id === workspace._id)
              ?.boards.length ?? 0,
          memberCount: workspace.members?.length ?? 0,
          updatedAt: workspace.updatedAt,
        }))}
      recentBoards={boards.slice(0, 4)}
      recentTasks={tasks.slice(0, 6)}
    />
  );
}
