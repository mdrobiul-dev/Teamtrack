import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  FolderKanban,
  Hash,
  Layout,
  Plus,
} from "lucide-react";
import { requireAuth } from "@/app/lib/auth";
import { boardService } from "@/app/services/board.service";
import { workspaceService } from "@/app/services/workspace.service";
import type { Board, Workspace } from "@/app/types/workspace";

export const metadata: Metadata = {
  title: "Boards - TeamTrack",
  description: "View every board across your workspaces",
};

type BoardWithWorkspace = Board & {
  workspaceName: string;
  workspaceId: string;
};

export default async function BoardsPage() {
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
  const hasBoards = boards.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
          <Link
            href="/workspaces"
            className="group flex w-fit items-center gap-2 px-3 py-2 -ml-3 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.02] transition-all duration-200"
          >
            <FolderKanban className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm">Workspaces</span>
          </Link>

          {hasBoards && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/30">
              <div className="flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5" />
                <span>
                  {boards.length} {boards.length === 1 ? "board" : "boards"}
                </span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5" />
                <span>
                  {workspaces.length}{" "}
                  {workspaces.length === 1 ? "workspace" : "workspaces"}
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
                <span className="shrink-0 text-white/30">All workspaces</span>
                <span className="min-w-0 truncate font-medium text-cyan-100/90">
                  {hasBoards ? "Boards overview" : "Setup required"}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white">
                Boards
              </h1>
              <p className="text-white/30 mt-2 text-sm">
                {hasBoards
                  ? "Browse every board you can access across your workspaces"
                  : "Create a workspace first, then add a board to start tracking work"}
              </p>
            </div>

            <Link
              href="/workspaces"
              className="group flex w-fit items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-cyan-400/20 text-white/60 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-medium">
                {workspaces.length ? "Choose Workspace" : "Create Workspace"}
              </span>
            </Link>
          </div>
        </div>

        {!hasBoards ? (
          <EmptyBoardsState workspaces={workspaces} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {boards.map((board, index) => (
                <BoardOverviewCard
                  key={board._id}
                  board={board}
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

function EmptyBoardsState({ workspaces }: { workspaces: Workspace[] }) {
  const hasWorkspaces = workspaces.length > 0;

  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="relative inline-block mb-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center relative z-10">
          <Layout className="w-12 h-12 text-cyan-400/40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-2xl opacity-50 animate-pulse" />
      </div>

      <h2 className="text-2xl font-semibold text-white/50 mb-3">
        No boards yet
      </h2>
      <p className="text-white/20 max-w-md mx-auto mb-8 text-sm leading-relaxed">
        {hasWorkspaces
          ? "You already have a workspace. Open one and create a board there to organize tasks, lists, and team progress."
          : "Boards belong inside workspaces. Create your first workspace, then add a board so your team has a place to plan work."}
      </p>

      <Link
        href={hasWorkspaces ? `/workspaces/${workspaces[0]._id}` : "/workspaces"}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-cyan-400/20 text-white/60 hover:text-white transition-all duration-300"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">
          {hasWorkspaces ? "Create a Board" : "Create Workspace First"}
        </span>
      </Link>
    </div>
  );
}

function BoardOverviewCard({
  board,
  animationDelay,
}: {
  board: BoardWithWorkspace;
  animationDelay: number;
}) {
  const createdDate = new Date(board.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/workspaces/${board.workspaceId}/boards/${board._id}`}
      className="group relative block overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/5 animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-cyan-400/20 transition-all duration-700" />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5 group-hover:border-cyan-400/20 flex items-center justify-center shrink-0 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition-all duration-300">
              <Layout className="w-5 h-5 text-cyan-400/80 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-white/90 font-medium group-hover:text-white transition-colors">
                {board.title}
              </h3>
              <p className="text-[11px] text-white/30 mt-1">
                Created {createdDate}
              </p>
            </div>
          </div>
          <ArrowUpRight className="ml-2 h-4 w-4 shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300" />
        </div>

        <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/35">
          <FolderKanban className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{board.workspaceName}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3 text-center">
            <Hash className="w-4 h-4 mx-auto text-white/30 mb-1" />
            <div className="text-lg font-semibold text-white/80">0</div>
            <div className="text-[10px] text-white/30">Lists</div>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3 text-center">
            <Calendar className="w-4 h-4 mx-auto text-white/30 mb-1" />
            <div className="text-lg font-semibold text-white/80">0</div>
            <div className="text-[10px] text-white/30">Tasks</div>
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-cyan-400/30 text-white/60 group-hover:text-white transition-all duration-300 text-sm font-medium">
          Open Board
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
