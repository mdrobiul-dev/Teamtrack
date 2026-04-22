"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  createWorkspaceAction,
  getMyWorkspacesAction,
} from "@/app/actions/workspace.actions";
import {
  createBoardAction,
  getBoardsByWorkspaceAction,
} from "@/app/actions/board.actions";
import {
  createListAction,
  getListsByBoardAction,
  reorderListsAction,
} from "@/app/actions/list.actions";
import {
  createTaskAction,
  deleteTaskAction,
  getTasksByListAction,
  moveTaskAction,
  reorderTasksAction,
} from "@/app/actions/task.actions";
import type { Workspace, Board, List } from "@/app/types/workspace";
import type { Task } from "@/app/types/task";

type TasksByList = Record<string, Task[]>;

export function KanbanBoardClient() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [tasksByList, setTasksByList] = useState<TasksByList>({});

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");

  const [workspaceName, setWorkspaceName] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [newListTitle, setNewListTitle] = useState("");
  const [newTaskByList, setNewTaskByList] = useState<Record<string, string>>({});

  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    sourceListId: string;
    sourceIndex: number;
  } | null>(null);

  const [draggedListId, setDraggedListId] = useState<string | null>(null);

  const orderedLists = useMemo(
    () => [...lists].sort((a, b) => a.order - b.order),
    [lists],
  );

  const setStatus = (text: string) => setMessage(text);

  const loadWorkspaces = () => {
    startTransition(async () => {
      const result = await getMyWorkspacesAction();
      setStatus(result.message);
      if (result.success && result.data) {
        setWorkspaces(result.data);
        if (!selectedWorkspaceId && result.data.length > 0) {
          setSelectedWorkspaceId(result.data[0]._id);
        }
      }
    });
  };

  const loadBoards = (workspaceId: string) => {
    if (!workspaceId) return;
    startTransition(async () => {
      const result = await getBoardsByWorkspaceAction({ workspaceId });
      setStatus(result.message);
      if (result.success && result.data) {
        setBoards(result.data);
        const firstBoardId = result.data[0]?._id || "";
        setSelectedBoardId(firstBoardId);
      }
    });
  };

  const loadListsAndTasks = (boardId: string) => {
    if (!boardId) return;
    startTransition(async () => {
      const listResult = await getListsByBoardAction({ boardId });
      setStatus(listResult.message);
      if (!listResult.success || !listResult.data) return;

      const nextLists = [...listResult.data].sort((a, b) => a.order - b.order);
      setLists(nextLists);

      const nextTasksByList: TasksByList = {};
      for (const list of nextLists) {
        const taskResult = await getTasksByListAction({ listId: list._id });
        nextTasksByList[list._id] = taskResult.success && taskResult.data
          ? [...taskResult.data].sort((a, b) => a.order - b.order)
          : [];
      }
      setTasksByList(nextTasksByList);
    });
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspaceId) loadBoards(selectedWorkspaceId);
  }, [selectedWorkspaceId]);

  useEffect(() => {
    if (selectedBoardId) loadListsAndTasks(selectedBoardId);
  }, [selectedBoardId]);

  const handleCreateWorkspace = () => {
    startTransition(async () => {
      const result = await createWorkspaceAction({ name: workspaceName });
      setStatus(result.message);
      if (result.success && result.data) {
        setWorkspaceName("");
        setWorkspaces((prev) => [result.data!, ...prev]);
        setSelectedWorkspaceId(result.data._id);
      }
    });
  };

  const handleCreateBoard = () => {
    if (!selectedWorkspaceId) {
      setStatus("Select workspace first");
      return;
    }
    startTransition(async () => {
      const result = await createBoardAction({
        workspaceId: selectedWorkspaceId,
        title: boardTitle,
      });
      setStatus(result.message);
      if (result.success && result.data) {
        setBoardTitle("");
        setBoards((prev) => [...prev, result.data!]);
        setSelectedBoardId(result.data._id);
      }
    });
  };

  const handleCreateList = () => {
    if (!selectedBoardId) {
      setStatus("Select board first");
      return;
    }
    startTransition(async () => {
      const result = await createListAction({ boardId: selectedBoardId, title: newListTitle });
      setStatus(result.message);
      if (result.success) {
        setNewListTitle("");
        loadListsAndTasks(selectedBoardId);
      }
    });
  };

  const handleCreateTask = (listId: string) => {
    const title = (newTaskByList[listId] || "").trim();
    if (!title) return;
    startTransition(async () => {
      const result = await createTaskAction({ title, listId, description: "" });
      setStatus(result.message);
      if (result.success) {
        setNewTaskByList((prev) => ({ ...prev, [listId]: "" }));
        loadListsAndTasks(selectedBoardId);
      }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    startTransition(async () => {
      const result = await deleteTaskAction({ taskId });
      setStatus(result.message);
      if (result.success) loadListsAndTasks(selectedBoardId);
    });
  };

  const handleTaskDrop = (targetListId: string, targetIndex: number) => {
    if (!draggedTask) return;

    const { taskId, sourceListId, sourceIndex } = draggedTask;
    setDraggedTask(null);

    if (sourceListId === targetListId) {
      const sourceTasks = [...(tasksByList[sourceListId] || [])].sort((a, b) => a.order - b.order);
      const [moved] = sourceTasks.splice(sourceIndex, 1);
      if (!moved) return;
      sourceTasks.splice(targetIndex, 0, moved);

      const items = sourceTasks.map((task, idx) => ({ id: task._id, order: idx + 1 }));
      startTransition(async () => {
        const result = await reorderTasksAction({ listId: sourceListId, items });
        setStatus(result.message);
        if (result.success) loadListsAndTasks(selectedBoardId);
      });
      return;
    }

    startTransition(async () => {
      const moveResult = await moveTaskAction({ taskId, targetListId });
      setStatus(moveResult.message);
      if (!moveResult.success) return;

      const targetTasks = [...(tasksByList[targetListId] || [])];
      const movedTask = (tasksByList[sourceListId] || []).find((t) => t._id === taskId);
      if (movedTask) {
        targetTasks.splice(targetIndex, 0, movedTask);
        const reorderItems = targetTasks.map((task, idx) => ({
          id: task._id,
          order: idx + 1,
        }));
        await reorderTasksAction({ listId: targetListId, items: reorderItems });
      }
      loadListsAndTasks(selectedBoardId);
    });
  };

  const handleListDrop = (targetListId: string) => {
    if (!draggedListId || draggedListId === targetListId) return;
    const listOrder = orderedLists.map((l) => l._id);
    const sourceIdx = listOrder.indexOf(draggedListId);
    const targetIdx = listOrder.indexOf(targetListId);
    if (sourceIdx < 0 || targetIdx < 0) return;

    listOrder.splice(sourceIdx, 1);
    listOrder.splice(targetIdx, 0, draggedListId);

    const items = listOrder.map((id, index) => ({ id, order: index + 1 }));
    setDraggedListId(null);
    startTransition(async () => {
      const result = await reorderListsAction({ items });
      setStatus(result.message);
      if (result.success) loadListsAndTasks(selectedBoardId);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kanban Board</CardTitle>
          <CardDescription>
            Drag tasks between lists. Drag list headers to reorder columns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Workspace</label>
              <select
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
              >
                <option value="">Select workspace</option>
                {workspaces.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Board</label>
              <select
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                value={selectedBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
              >
                <option value="">Select board</option>
                {boards.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
            <Input
              placeholder="New workspace"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <Button
              onClick={handleCreateWorkspace}
              disabled={isPending || workspaceName.trim().length < 2}
            >
              Create Workspace
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
            <Input
              placeholder="New board title"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
            />
            <Button
              onClick={handleCreateBoard}
              disabled={isPending || !selectedWorkspaceId || boardTitle.trim().length < 2}
            >
              Create Board
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            {message || "Create/select a board to start managing lists and tasks."}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Input
          placeholder="Add a new list..."
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={handleCreateList}
          disabled={isPending || !selectedBoardId || newListTitle.trim().length < 2}
        >
          Add List
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {orderedLists.map((list) => {
          const listTasks = [...(tasksByList[list._id] || [])].sort((a, b) => a.order - b.order);
          return (
            <div
              key={list._id}
              className="w-80 shrink-0 rounded-lg border bg-white"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleListDrop(list._id)}
            >
              <div
                className="p-3 border-b bg-gray-50 cursor-grab"
                draggable
                onDragStart={() => setDraggedListId(list._id)}
              >
                <h3 className="font-semibold">{list.title}</h3>
                <p className="text-xs text-gray-500">{listTasks.length} tasks</p>
              </div>

              <div className="p-3 space-y-3 min-h-36">
                {listTasks.map((task, index) => (
                  <div
                    key={task._id}
                    className="rounded-md border bg-white p-3 shadow-xs"
                    draggable
                    onDragStart={() =>
                      setDraggedTask({ taskId: task._id, sourceListId: list._id, sourceIndex: index })
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleTaskDrop(list._id, index)}
                  >
                    <p className="font-medium text-sm">{task.title}</p>
                    {task.description ? (
                      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                    ) : null}
                    <div className="mt-3 flex justify-end">
                      <button
                        className="text-xs text-red-600 hover:underline"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  className="rounded-md border border-dashed p-2 text-xs text-gray-500"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleTaskDrop(list._id, listTasks.length)}
                >
                  Drop task here
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="New task..."
                    value={newTaskByList[list._id] || ""}
                    onChange={(e) =>
                      setNewTaskByList((prev) => ({ ...prev, [list._id]: e.target.value }))
                    }
                  />
                  <Button
                    size="sm"
                    onClick={() => handleCreateTask(list._id)}
                    disabled={isPending || !(newTaskByList[list._id] || "").trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
