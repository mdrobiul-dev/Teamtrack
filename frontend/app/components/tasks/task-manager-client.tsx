"use client";

import { type ReactNode, useEffect, useMemo, useState, useTransition } from "react";
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
  assignTaskAction,
  createTaskAction,
  deleteTaskAction,
  getBoardsByWorkspaceAction,
  getListsByBoardAction,
  getTasksByListAction,
  getWorkspacesAction,
  moveTaskAction,
  reorderTasksAction,
  unassignTaskAction,
} from "@/app/actions/task.actions";
import type { BoardOption, ListOption, Task, WorkspaceOption } from "@/app/types/task";

export function TaskManagerClient() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>("");
  const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([]);
  const [boards, setBoards] = useState<BoardOption[]>([]);
  const [lists, setLists] = useState<ListOption[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [selectedListId, setSelectedListId] = useState("");

  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
  });
  const [userIdForAssign, setUserIdForAssign] = useState("");
  const [targetListIdForMove, setTargetListIdForMove] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const setResultMessage = (text: string) => {
    setMessage(text);
  };

  const selectedList = useMemo(
    () => lists.find((list) => list._id === selectedListId) ?? null,
    [lists, selectedListId],
  );

  const loadTasksForList = (listId: string) => {
    startTransition(async () => {
      const result = await getTasksByListAction({ listId });
      setResultMessage(result.message);
      if (result.success && result.data) {
        setTasks(result.data);
      }
    });
  };

  useEffect(() => {
    startTransition(async () => {
      const result = await getWorkspacesAction();
      setResultMessage(result.message);
      if (result.success && result.data) {
        setWorkspaces(result.data);
        if (result.data.length > 0) {
          setSelectedWorkspaceId(result.data[0]._id);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedWorkspaceId) return;
    startTransition(async () => {
      const result = await getBoardsByWorkspaceAction({
        workspaceId: selectedWorkspaceId,
      });
      setResultMessage(result.message);
      if (result.success && result.data) {
        setBoards(result.data);
        const firstBoardId = result.data[0]?._id ?? "";
        setSelectedBoardId(firstBoardId);
        setLists([]);
        setSelectedListId("");
        setTasks([]);
      }
    });
  }, [selectedWorkspaceId]);

  useEffect(() => {
    if (!selectedBoardId) return;
    startTransition(async () => {
      const result = await getListsByBoardAction({ boardId: selectedBoardId });
      setResultMessage(result.message);
      if (result.success && result.data) {
        const sortedLists = [...result.data].sort((a, b) => a.order - b.order);
        setLists(sortedLists);
        const firstListId = sortedLists[0]?._id ?? "";
        setSelectedListId(firstListId);
        setTargetListIdForMove(firstListId);
        setTasks([]);
      }
    });
  }, [selectedBoardId]);

  useEffect(() => {
    if (!selectedListId) return;
    loadTasksForList(selectedListId);
  }, [selectedListId]);

  const handleCreateTask = () => {
    startTransition(async () => {
      const result = await createTaskAction({
        title: createForm.title,
        description: createForm.description,
        listId: selectedListId,
      });
      setResultMessage(result.message);
      if (result.success) {
        setCreateForm({ title: "", description: "" });
        loadTasksForList(selectedListId);
      }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    startTransition(async () => {
      const result = await deleteTaskAction({ taskId });
      setResultMessage(result.message);
      if (result.success) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
      }
    });
  };

  const handleAssignTask = (taskId: string) => {
    if (!userIdForAssign.trim()) {
      setResultMessage("Please enter a user ID for assignment");
      return;
    }
    startTransition(async () => {
      const result = await assignTaskAction({ taskId, userId: userIdForAssign });
      setResultMessage(result.message);
      if (result.success) {
        loadTasksForList(selectedListId);
      }
    });
  };

  const handleUnassignTask = (taskId: string) => {
    startTransition(async () => {
      const result = await unassignTaskAction({ taskId });
      setResultMessage(result.message);
      if (result.success) {
        loadTasksForList(selectedListId);
      }
    });
  };

  const handleMoveTask = (taskId: string) => {
    if (!targetListIdForMove) {
      setResultMessage("Please choose target list");
      return;
    }
    startTransition(async () => {
      const result = await moveTaskAction({
        taskId,
        targetListId: targetListIdForMove,
      });
      setResultMessage(result.message);
      if (result.success) {
        loadTasksForList(selectedListId);
      }
    });
  };

  const handleReorderByDirection = (taskId: string, direction: "up" | "down") => {
    const sorted = [...tasks].sort((a, b) => a.order - b.order);
    const currentIndex = sorted.findIndex((task) => task._id === taskId);
    if (currentIndex < 0) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    [sorted[currentIndex], sorted[targetIndex]] = [sorted[targetIndex], sorted[currentIndex]];

    const items = sorted.map((task, index) => ({
      id: task._id,
      order: index + 1,
    }));

    startTransition(async () => {
      const result = await reorderTasksAction({
        listId: selectedListId,
        items,
      });
      setResultMessage(result.message);
      if (result.success) {
        loadTasksForList(selectedListId);
      }
    });
  };

  const canCreateTask = Boolean(selectedListId && createForm.title.trim());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>
            Production-friendly task workflow connected to your backend controllers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Workspace</label>
              <select
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
              >
                <option value="">Select workspace</option>
                {workspaces.map((workspace) => (
                  <option key={workspace._id} value={workspace._id}>
                    {workspace.name}
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
                {boards.map((board) => (
                  <option key={board._id} value={board._id}>
                    {board.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">List</label>
              <select
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
              >
                <option value="">Select list</option>
                {lists.map((list) => (
                  <option key={list._id} value={list._id}>
                    {list.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-md bg-muted px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="min-w-0 text-muted-foreground">
              {selectedList ? `Selected List: ${selectedList.title}` : "Select list to manage tasks"}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="w-full shrink-0 sm:w-auto"
              onClick={() => selectedListId && loadTasksForList(selectedListId)}
              disabled={!selectedListId || isPending}
            >
              Refresh Tasks
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {message || "Run an action to see API response message here."}
          </p>
        </CardContent>
      </Card>

      <ActionCard
        title="Create Task"
        description="Create task inside selected list"
      >
        <Input
          placeholder="Task title"
          value={createForm.title}
          onChange={(e) =>
            setCreateForm((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <textarea
          className="w-full min-h-24 rounded-md border border-gray-300 p-3 text-sm"
          placeholder="Description (optional)"
          value={createForm.description}
          onChange={(e) =>
            setCreateForm((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <Button onClick={handleCreateTask} disabled={isPending || !canCreateTask}>
          {isPending ? "Please wait..." : "Create Task"}
        </Button>
      </ActionCard>

      <ActionCard title="Task Actions" description="Set once, use on any task row">
        <Input
          placeholder="User ID for assign action"
          value={userIdForAssign}
          onChange={(e) => setUserIdForAssign(e.target.value)}
        />
        <select
          className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
          value={targetListIdForMove}
          onChange={(e) => setTargetListIdForMove(e.target.value)}
        >
          <option value="">Select move target list</option>
          {lists.map((list) => (
            <option key={list._id} value={list._id}>
              {list.title}
            </option>
          ))}
        </select>
      </ActionCard>

      <Card>
        <CardHeader>
          <CardTitle>Tasks ({tasks.length})</CardTitle>
          <CardDescription>
            Manage tasks with one-click actions (assign, move, reorder, delete)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tasks found in selected list.
            </p>
          )}

          {tasks
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <div
                key={task._id}
                className="rounded-lg border p-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {task.description || "No description"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Order: {task.order} | Assigned:{" "}
                    {typeof task.assignedTo === "string"
                      ? task.assignedTo
                      : task.assignedTo?.name || "Unassigned"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedTask(task)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAssignTask(task._id)}
                    disabled={isPending}
                  >
                    Assign
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUnassignTask(task._id)}
                    disabled={isPending}
                  >
                    Unassign
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveTask(task._id)}
                    disabled={isPending}
                  >
                    Move
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReorderByDirection(task._id, "up")}
                    disabled={isPending}
                  >
                    Up
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReorderByDirection(task._id, "down")}
                    disabled={isPending}
                  >
                    Down
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteTask(task._id)}
                    disabled={isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {selectedTask && (
        <Card>
          <CardHeader>
            <CardTitle>Task Detail</CardTitle>
            <CardDescription>Latest selected task payload</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
              {JSON.stringify(selectedTask, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}
