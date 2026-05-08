"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckSquare,
  GripVertical,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { createListAction, deleteListAction } from "@/app/actions/list.actions";
import {
  createTaskAction,
  deleteTaskAction,
  moveTaskAction,
  reorderTasksAction,
} from "@/app/actions/task.actions";
import type { Board, List } from "@/app/types/workspace";
import type { Task } from "@/app/types/task";

type TasksByList = Record<string, Task[]>;
type TaskInputs = Record<string, string>;

interface WorkspaceBoardPageClientProps {
  workspaceId: string;
  workspaceName: string;
  board: Board;
  initialLists: List[];
  initialTasksByList: TasksByList;
}

export function WorkspaceBoardPageClient({
  workspaceId,
  workspaceName,
  board,
  initialLists,
  initialTasksByList,
}: WorkspaceBoardPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isStarred, setIsStarred] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [lists, setLists] = useState<List[]>(initialLists);
  const [tasksByList, setTasksByList] = useState<TasksByList>(initialTasksByList);
  const [taskInputs, setTaskInputs] = useState<TaskInputs>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [message, setMessage] = useState("");
  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    sourceListId: string;
    sourceIndex: number;
  } | null>(null);

  const sortedLists = useMemo(
    () => [...lists].sort((a, b) => a.order - b.order),
    [lists],
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const totalTasks = useMemo(
    () =>
      Object.values(tasksByList).reduce((total, tasks) => total + tasks.length, 0),
    [tasksByList],
  );

  const completedTasks = completedTaskIds.size;

  const handleCreateList = () => {
    const title = newListName.trim();
    if (!title || isPending) return;

    startTransition(async () => {
      const result = await createListAction({ boardId: board._id, title });
      setMessage(result.message);

      if (result.success && result.data) {
        setLists((prev) => [...prev, result.data!]);
        setTasksByList((prev) => ({ ...prev, [result.data!._id]: [] }));
        setNewListName("");
        router.refresh();
      }
    });
  };

  const handleDeleteList = (listId: string) => {
    if (!listId || isPending) return;

    const previousLists = lists;
    const previousTasksByList = tasksByList;

    setLists((prev) => prev.filter((list) => list._id !== listId));
    setTasksByList((prev) => {
      const next = { ...prev };
      delete next[listId];
      return next;
    });

    startTransition(async () => {
      const result = await deleteListAction({
        workspaceId,
        boardId: board._id,
        listId,
      });
      setMessage(result.message);

      if (!result.success) {
        setLists(previousLists);
        setTasksByList(previousTasksByList);
      } else {
        router.refresh();
      }
    });
  };

  const handleTaskInputChange = (listId: string, value: string) => {
    setTaskInputs((prev) => ({ ...prev, [listId]: value }));
  };

  const handleAddTask = (listId: string) => {
    const title = taskInputs[listId]?.trim();
    if (!title || isPending) return;

    startTransition(async () => {
      const result = await createTaskAction({ title, listId, description: "" });
      setMessage(result.message);

      if (result.success && result.data) {
        setTasksByList((prev) => ({
          ...prev,
          [listId]: [...(prev[listId] || []), result.data!],
        }));
        setTaskInputs((prev) => ({ ...prev, [listId]: "" }));
        router.refresh();
      }
    });
  };

  const handleDeleteTask = (listId: string, taskId: string) => {
    const previousTasks = tasksByList[listId] || [];

    setTasksByList((prev) => ({
      ...prev,
      [listId]: previousTasks.filter((task) => task._id !== taskId),
    }));

    startTransition(async () => {
      const result = await deleteTaskAction({ taskId });
      setMessage(result.message);

      if (!result.success) {
        setTasksByList((prev) => ({ ...prev, [listId]: previousTasks }));
      } else {
        setCompletedTaskIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
        router.refresh();
      }
    });
  };

  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const handleTaskDrop = (targetListId: string, targetIndex: number) => {
    if (!draggedTask) return;

    const { taskId, sourceListId, sourceIndex } = draggedTask;
    setDraggedTask(null);

    if (sourceListId === targetListId) {
      const sourceTasks = [...(tasksByList[sourceListId] || [])].sort(
        (a, b) => a.order - b.order,
      );
      const [movedTask] = sourceTasks.splice(sourceIndex, 1);
      if (!movedTask) return;
      sourceTasks.splice(targetIndex, 0, movedTask);

      const items = sourceTasks.map((task, index) => ({
        id: task._id,
        order: index + 1,
      }));

      setTasksByList((prev) => ({ ...prev, [sourceListId]: sourceTasks }));
      startTransition(async () => {
        const result = await reorderTasksAction({ listId: sourceListId, items });
        setMessage(result.message);
        if (result.success) router.refresh();
      });
      return;
    }

    const sourceTasks = [...(tasksByList[sourceListId] || [])].sort(
      (a, b) => a.order - b.order,
    );
    const targetTasks = [...(tasksByList[targetListId] || [])].sort(
      (a, b) => a.order - b.order,
    );
    const [movedTask] = sourceTasks.splice(sourceIndex, 1);
    if (!movedTask) return;

    targetTasks.splice(targetIndex, 0, { ...movedTask, list: targetListId });
    setTasksByList((prev) => ({
      ...prev,
      [sourceListId]: sourceTasks,
      [targetListId]: targetTasks,
    }));

    startTransition(async () => {
      const moveResult = await moveTaskAction({ taskId, targetListId });
      const reorderItems = targetTasks.map((task, index) => ({
        id: task._id,
        order: index + 1,
      }));

      if (moveResult.success) {
        const reorderResult = await reorderTasksAction({
          listId: targetListId,
          items: reorderItems,
        });
        setMessage(reorderResult.message);
      } else {
        setMessage(moveResult.message);
      }

      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative min-h-screen flex flex-col">
        <header className="border-b border-white/5 bg-[#0a0a1a]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.push(`/workspaces/${workspaceId}`)}
                  className="group flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors duration-200"
                  aria-label="Back to workspace boards"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="flex min-w-0 items-center gap-3">
                  <h1 className="truncate text-xl font-semibold text-white/90">
                    {board.title}
                  </h1>

                  <button
                    type="button"
                    onClick={() => setIsStarred(!isStarred)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200"
                    aria-label={isStarred ? "Unstar board" : "Star board"}
                  >
                    <Star
                      className={`w-4 h-4 transition-all duration-300 ${
                        isStarred
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/30 hover:text-yellow-400/70"
                      }`}
                    />
                  </button>

                  <div className="hidden sm:block h-4 w-px bg-white/10" />

                  <div className="hidden sm:flex items-center gap-2 text-sm text-white/50">
                    <div className="flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4" />
                      <span>
                        {completedTasks}/{totalTasks}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{workspaceName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div
                  className={`hidden sm:flex items-center gap-2 transition-all duration-300 ${
                    showSearch ? "w-64" : "w-0"
                  } overflow-hidden`}
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/90 placeholder:text-white/20 text-sm focus:outline-none focus:border-cyan-400/30"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white/90 transition-all duration-200"
                  aria-label="Toggle task search"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  type="button"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white/90 transition-all duration-200"
                  aria-label="Board settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
          <div className="flex-shrink-0 mb-4">
            <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4" />
          </div>

          <div className="flex-shrink-0 mb-4">
            <div className="flex flex-col gap-3 max-w-md sm:flex-row">
              <input
                type="text"
                placeholder="Enter list name..."
                value={newListName}
                onChange={(event) => setNewListName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleCreateList();
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-500/50 border border-white/10 transition"
              />
              <button
                type="button"
                onClick={handleCreateList}
                disabled={!newListName.trim() || isPending}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
                Create List
              </button>
            </div>
            {message && <p className="mt-3 text-sm text-white/35">{message}</p>}
          </div>

          <div className="flex-1">
            {sortedLists.length === 0 ? (
              <div className="h-full flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 flex items-center justify-center">
                    <CheckSquare className="w-10 h-10 text-cyan-400/50" />
                  </div>
                  <h3 className="text-xl font-medium text-white/40 mb-2">
                    No lists yet
                  </h3>
                  <p className="text-sm text-white/30">
                    Create your first list to get started
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-4">
                {sortedLists.map((list) => {
                  const listTasks = [...(tasksByList[list._id] || [])].sort(
                    (a, b) => a.order - b.order,
                  );
                  const visibleTasks = normalizedQuery
                    ? listTasks.filter((task) =>
                        task.title.toLowerCase().includes(normalizedQuery),
                      )
                    : listTasks;

                  return (
                    <div
                      key={list._id}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handleTaskDrop(list._id, visibleTasks.length)}
                      className="w-full min-w-0 flex flex-col bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300 max-h-[520px]"
                    >
                      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <GripVertical className="w-4 h-4 shrink-0 text-white/20 cursor-grab" />
                          <h3 className="truncate text-white font-semibold text-lg">
                            {list.title}
                          </h3>
                          <span className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-white/40 border border-white/10">
                            {listTasks.length}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteList(list._id)}
                          disabled={isPending}
                          className="text-white/40 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-400/10 disabled:opacity-40"
                          aria-label={`Delete ${list.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
                        {visibleTasks.length === 0 ? (
                          <p className="text-white/30 text-sm text-center py-4">
                            {normalizedQuery ? "No matching tasks" : "No tasks yet"}
                          </p>
                        ) : (
                          visibleTasks.map((task, index) => {
                            const completed = completedTaskIds.has(task._id);

                            return (
                              <div
                                key={task._id}
                                draggable
                                onDragStart={() =>
                                  setDraggedTask({
                                    taskId: task._id,
                                    sourceListId: list._id,
                                    sourceIndex: index,
                                  })
                                }
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={(event) => {
                                  event.stopPropagation();
                                  handleTaskDrop(list._id, index);
                                }}
                                className="group flex items-start gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all duration-200 cursor-grab"
                              >
                                <input
                                  type="checkbox"
                                  checked={completed}
                                  onChange={() => handleToggleTask(task._id)}
                                  className="mt-0.5 w-4 h-4 rounded border-white/20 text-cyan-500 focus:ring-cyan-500/50 bg-white/5 cursor-pointer"
                                />
                                <div className="flex-1 min-w-0">
                                  <span
                                    className={`text-sm break-words ${
                                      completed
                                        ? "text-white/30 line-through"
                                        : "text-white/80"
                                    }`}
                                  >
                                    {task.title}
                                  </span>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                      medium
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTask(list._id, task._id)}
                                  className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition p-0.5"
                                  aria-label={`Delete ${task.title}`}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <div className="px-4 pb-4 pt-2 border-t border-white/5 flex-shrink-0">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a task..."
                            value={taskInputs[list._id] || ""}
                            onChange={(event) =>
                              handleTaskInputChange(list._id, event.target.value)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") handleAddTask(list._id);
                            }}
                            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/5 text-white text-sm placeholder:text-white/40 outline-none focus:ring-1 focus:ring-cyan-500/50 border border-white/10 transition"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTask(list._id)}
                            disabled={!taskInputs[list._id]?.trim() || isPending}
                            className="px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-sm font-medium transition border border-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label={`Add task to ${list.title}`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
