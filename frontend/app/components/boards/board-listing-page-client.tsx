"use client";

import { MouseEvent, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Hash,
  Layout,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  createBoardAction,
  deleteBoardAction,
} from "@/app/actions/board.actions";
import type { Board } from "@/app/types/workspace";

interface BoardListingPageClientProps {
  workspaceId: string;
  workspaceName: string;
  initialBoards: Board[];
}

export function BoardListingPageClient({
  workspaceId,
  workspaceName,
  initialBoards,
}: BoardListingPageClientProps) {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [boardName, setBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingBoardId, setDeletingBoardId] = useState("");

  const handleCreateBoard = () => {
    const title = boardName.trim();

    if (!title || isPending) return;

    setError("");
    startTransition(async () => {
      const result = await createBoardAction({ workspaceId, title });

      if (!result.success || !result.data) {
        setError(result.message || "Could not create board");
        return;
      }

      setBoards((prev) => [result.data!, ...prev]);
      setBoardName("");
      setIsCreating(false);
      router.refresh();
    });
  };

  const handleDeleteBoard = (boardId: string) => {
    if (!boardId || deletingBoardId) return;

    const boardToDelete = boards.find((board) => board._id === boardId);

    setError("");
    setDeletingBoardId(boardId);
    setBoards((prev) => prev.filter((board) => board._id !== boardId));

    startTransition(async () => {
      const result = await deleteBoardAction({ workspaceId, boardId });

      if (!result.success) {
        if (boardToDelete) {
          setBoards((prev) => [boardToDelete, ...prev]);
        }
        setError(result.message || "Could not delete board");
      }

      setDeletingBoardId("");
      router.refresh();
    });
  };

  const totalTasks = 0;
  const totalLists = 0;
  const hasBoards = boards.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
          <button
            onClick={() => router.push("/workspaces")}
            className="group flex w-fit items-center gap-2 px-3 py-2 -ml-3 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.02] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm">Back to Workspaces</span>
          </button>

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
                <Hash className="w-3.5 h-3.5" />
                <span>{totalLists} lists</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{totalTasks} tasks</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2 text-sm text-white/50">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                <span className="shrink-0 text-white/30">Workspace</span>
                <span className="min-w-0 truncate font-medium text-cyan-100/90">
                  {workspaceName}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white">
                Boards
              </h1>
              <p className="text-white/30 mt-2 text-sm">
                {hasBoards
                  ? "Manage and organize your project boards"
                  : "Create your first board to get started"}
              </p>
            </div>

            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="group flex w-fit items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-cyan-400/20 text-white/60 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-sm font-medium">New Board</span>
              </button>
            )}
          </div>
        </div>

        {isCreating && (
          <div className="mb-8 animate-fade-in">
            <div className="relative max-w-xl">
              <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-purple-500/0 rounded-2xl blur-sm opacity-50" />

              <div className="relative p-6 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center">
                    <Layout className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white/80">
                    Create New Board
                  </h3>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter board name..."
                    value={boardName}
                    onChange={(event) => setBoardName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleCreateBoard();
                      if (event.key === "Escape") {
                        setIsCreating(false);
                        setBoardName("");
                        setError("");
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] text-white placeholder:text-white/20 border border-white/[0.08] outline-none focus:border-cyan-400/30 focus:bg-white/[0.05] transition-all duration-200"
                    autoFocus
                  />

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCreateBoard}
                      disabled={!boardName.trim() || isPending}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/20 hover:border-cyan-400/30 text-cyan-400 font-medium text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Creating..." : "Create Board"}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setBoardName("");
                        setError("");
                      }}
                      className="px-4 py-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.02] transition-all duration-200 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasBoards && !isCreating && (
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
              Create your first board to start organizing tasks, tracking
              progress, and collaborating with your team.
            </p>

            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-cyan-400/20 text-white/60 hover:text-white transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">
                Create Your First Board
              </span>
            </button>
          </div>
        )}

        {hasBoards && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board, index) => (
              <BoardCard
                key={board._id}
                board={board}
                workspaceId={workspaceId}
                animationDelay={index * 50}
                isDeleting={deletingBoardId === board._id}
                onDelete={handleDeleteBoard}
              />
            ))}
          </div>
        )}

        {hasBoards && (
          <div className="mt-16 flex justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}

function BoardCard({
  board,
  workspaceId,
  animationDelay,
  isDeleting,
  onDelete,
}: {
  board: Board;
  workspaceId: string;
  animationDelay: number;
  isDeleting: boolean;
  onDelete: (boardId: string) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const createdDate = new Date(board.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (showDeleteConfirm) {
      onDelete(board._id);
      setShowDeleteConfirm(false);
      return;
    }

    setShowDeleteConfirm(true);
  };

  const cancelDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <Link
      href={`/boards?workspaceId=${workspaceId}&boardId=${board._id}`}
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
          {showDeleteConfirm ? (
            <div className="ml-2 flex shrink-0 items-center gap-1 animate-fade-in">
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting" : "Confirm"}
              </button>
              <button
                type="button"
                onClick={cancelDelete}
                disabled={isDeleting}
                className="rounded-lg p-1.5 text-white/40 transition-all hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Cancel board delete"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="ml-2 rounded-lg p-2 text-white/20 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Delete ${board.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
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
