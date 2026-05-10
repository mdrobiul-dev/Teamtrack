import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckSquare,
  ClipboardList,
  FolderKanban,
  Hash,
  Layout,
  ListChecks,
  Plus,
} from "lucide-react";
import { requireAuth } from "@/app/lib/auth";
import { boardService } from "@/app/services/board.service";
import { listService } from "@/app/services/list.service";
import { taskService } from "@/app/services/task.service";
import { workspaceService } from "@/app/services/workspace.service";
import type { Board, List, Workspace } from "@/app/types/workspace";
import type { Task } from "@/app/types/task";

export const metadata: Metadata = {
  title: "Task Lists - TeamTrack",
  description: "View every list and task across your boards",
};

type BoardWithWorkspace = Board & {
  workspaceId: string;
  workspaceName: string;
};

type ListWithContext = List & {
  boardId: string;
  boardTitle: string;
  workspaceId: string;
  workspaceName: string;
  tasks: Task[];
};

export default async function TaskListsPage() {
  await requireAuth();

  const workspaces = await workspaceService.getMyWorkspaces();
  const boardGroups = await Promise.all(
    workspaces.map(async (workspace) => ({
      workspace,
      boards: await boardService.getBoardsByWorkspace(workspace._id),
    })),
  );

  const boards = boardGroups.flatMap(({ workspace, boards }) =>
    boards.map((board) => ({
      ...board,
      workspaceId: workspace._id,
      workspaceName: workspace.name,
    })),
  );

  const listGroups = await Promise.all(
    boards.map(async (board) => ({
      board,
      lists: await listService.getListsByBoard(board._id),
    })),
  );

  const listsWithTasks = (
    await Promise.all(
      listGroups.flatMap(({ board, lists }) =>
        lists.map(async (list) => ({
          ...list,
          boardId: board._id,
          boardTitle: board.title,
          workspaceId: board.workspaceId,
          workspaceName: board.workspaceName,
          tasks: await taskService.getTasksByList(list._id),
        })),
      ),
    )
  ).sort((a, b) => a.workspaceName.localeCompare(b.workspaceName));

  const totalTasks = listsWithTasks.reduce(
    (total, list) => total + list.tasks.length,
    0,
  );
  const hasLists = listsWithTasks.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
          <Link
            href="/boards"
            className="group flex w-fit items-center gap-2 px-3 py-2 -ml-3 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.02] transition-all duration-200"
          >
            <ClipboardList className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm">Boards</span>
          </Link>

          {hasLists && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/30">
              <div className="flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5" />
                <span>
                  {listsWithTasks.length}{" "}
                  {listsWithTasks.length === 1 ? "list" : "lists"}
                </span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>
                  {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
                </span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5" />
                <span>
                  {boards.length} {boards.length === 1 ? "board" : "boards"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2 text-sm text-white/50">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                <span className="shrink-0 text-white/30">All boards</span>
                <span className="min-w-0 truncate font-medium text-cyan-100/90">
                  {hasLists ? "Lists and tasks overview" : "Setup required"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white sm:text-4xl">
                Task Lists
              </h1>
              <p className="text-white/30 mt-2 text-sm">
                {hasLists
                  ? "Browse every list and task you can access across your boards"
                  : "Create a board first, then add lists and tasks inside it"}
              </p>
            </div>

            <Link
              href={getPrimaryActionHref(workspaces, boards)}
              className="group flex w-fit items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-cyan-400/20 text-white/60 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-medium">
                {getPrimaryActionLabel(workspaces, boards)}
              </span>
            </Link>
          </div>
        </div>

        {!hasLists ? (
          <EmptyTaskListsState workspaces={workspaces} boards={boards} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {listsWithTasks.map((list, index) => (
                <TaskListOverviewCard
                  key={list._id}
                  list={list}
                  animationDelay={index * 50}
                />
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getPrimaryActionHref(
  workspaces: Workspace[],
  boards: BoardWithWorkspace[],
) {
  if (boards.length) {
    const board = boards[0];
    return `/workspaces/${board.workspaceId}/boards/${board._id}`;
  }

  if (workspaces.length) {
    return `/workspaces/${workspaces[0]._id}`;
  }

  return "/workspaces";
}

function getPrimaryActionLabel(
  workspaces: Workspace[],
  boards: BoardWithWorkspace[],
) {
  if (boards.length) return "Create List";
  if (workspaces.length) return "Create Board";
  return "Create Workspace";
}

function EmptyTaskListsState({
  workspaces,
  boards,
}: {
  workspaces: Workspace[];
  boards: BoardWithWorkspace[];
}) {
  const hasBoards = boards.length > 0;
  const hasWorkspaces = workspaces.length > 0;

  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="relative inline-block mb-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center relative z-10">
          <ListChecks className="w-12 h-12 text-cyan-400/40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-2xl opacity-50 animate-pulse" />
      </div>

      <h2 className="text-2xl font-semibold text-white/50 mb-3">
        No lists or tasks yet
      </h2>
      <p className="text-white/20 max-w-md mx-auto mb-8 text-sm leading-relaxed">
        {hasBoards
          ? "Open one of your boards and create a list. Tasks live inside lists, so that is where your work starts."
          : hasWorkspaces
            ? "You already have a workspace. Create a board first, then add lists and tasks inside that board."
            : "Create a workspace first, then add a board, lists, and tasks as your project grows."}
      </p>

      <Link
        href={getPrimaryActionHref(workspaces, boards)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-cyan-400/20 text-white/60 hover:text-white transition-all duration-300"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">
          {getPrimaryActionLabel(workspaces, boards)}
        </span>
      </Link>
    </div>
  );
}

function TaskListOverviewCard({
  list,
  animationDelay,
}: {
  list: ListWithContext;
  animationDelay: number;
}) {
  const createdDate = new Date(list.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const previewTasks = [...list.tasks]
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);
  const hiddenTaskCount = Math.max(list.tasks.length - previewTasks.length, 0);

  return (
    <Link
      href={`/workspaces/${list.workspaceId}/boards/${list.boardId}`}
      className="group relative block overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/5 animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-cyan-400/20 transition-all duration-700" />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5 group-hover:border-cyan-400/20 flex items-center justify-center shrink-0 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition-all duration-300">
              <ListChecks className="w-5 h-5 text-cyan-400/80 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-white/90 font-medium group-hover:text-white transition-colors">
                {list.title}
              </h3>
              <p className="text-[11px] text-white/30 mt-1">
                Created {createdDate}
              </p>
            </div>
          </div>
          <ArrowUpRight className="ml-2 h-4 w-4 shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300" />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/35">
            <Layout className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{list.boardTitle}</span>
          </span>
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/35">
            <FolderKanban className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{list.workspaceName}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3 text-center">
            <Hash className="w-4 h-4 mx-auto text-white/30 mb-1" />
            <div className="text-lg font-semibold text-white/80">
              {list.order}
            </div>
            <div className="text-[10px] text-white/30">Order</div>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3 text-center">
            <CheckSquare className="w-4 h-4 mx-auto text-white/30 mb-1" />
            <div className="text-lg font-semibold text-white/80">
              {list.tasks.length}
            </div>
            <div className="text-[10px] text-white/30">Tasks</div>
          </div>
        </div>

        <div className="min-h-28 space-y-2">
          {previewTasks.length ? (
            <>
              {previewTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2"
                >
                  <CheckSquare className="h-3.5 w-3.5 shrink-0 text-white/25" />
                  <span className="min-w-0 truncate text-sm text-white/55">
                    {task.title}
                  </span>
                </div>
              ))}
              {hiddenTaskCount > 0 && (
                <p className="px-1 text-xs text-white/25">
                  +{hiddenTaskCount} more{" "}
                  {hiddenTaskCount === 1 ? "task" : "tasks"}
                </p>
              )}
            </>
          ) : (
            <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] text-sm text-white/25">
              No tasks in this list yet
            </div>
          )}
        </div>

        <div className="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-cyan-400/30 text-white/60 group-hover:text-white transition-all duration-300 text-sm font-medium">
          Open Board
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
