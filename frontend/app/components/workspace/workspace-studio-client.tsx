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
} from "@/app/actions/list.actions";
import {
  createTaskAction,
  getTasksByListAction,
} from "@/app/actions/task.actions";
import type { Board, List, Workspace } from "@/app/types/workspace";
import type { Task } from "@/app/types/task";

export function WorkspaceStudioClient() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [selectedListId, setSelectedListId] = useState("");

  const [workspaceName, setWorkspaceName] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [listTitle, setListTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const setStatus = (text: string) => setMessage(text);

  const selectedWorkspace = useMemo(
    () => workspaces.find((w) => w._id === selectedWorkspaceId),
    [workspaces, selectedWorkspaceId],
  );
  const selectedBoard = useMemo(
    () => boards.find((b) => b._id === selectedBoardId),
    [boards, selectedBoardId],
  );
  const selectedList = useMemo(
    () => lists.find((l) => l._id === selectedListId),
    [lists, selectedListId],
  );

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
        setLists([]);
        setTasks([]);
      }
    });
  };

  const loadLists = (boardId: string) => {
    if (!boardId) return;
    startTransition(async () => {
      const result = await getListsByBoardAction({ boardId });
      setStatus(result.message);
      if (result.success && result.data) {
        const sorted = [...result.data].sort((a, b) => a.order - b.order);
        setLists(sorted);
        const firstListId = sorted[0]?._id || "";
        setSelectedListId(firstListId);
        setTasks([]);
      }
    });
  };

  const loadTasks = (listId: string) => {
    if (!listId) return;
    startTransition(async () => {
      const result = await getTasksByListAction({ listId });
      setStatus(result.message);
      if (result.success && result.data) {
        const sorted = [...result.data].sort((a, b) => a.order - b.order);
        setTasks(sorted);
      }
    });
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspaceId) {
      loadBoards(selectedWorkspaceId);
    }
  }, [selectedWorkspaceId]);

  useEffect(() => {
    if (selectedBoardId) {
      loadLists(selectedBoardId);
    }
  }, [selectedBoardId]);

  useEffect(() => {
    if (selectedListId) {
      loadTasks(selectedListId);
    }
  }, [selectedListId]);

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
      setStatus("Please select a workspace first");
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
      }
    });
  };

  const handleCreateList = () => {
    if (!selectedBoardId) {
      setStatus("Please select a board first");
      return;
    }
    startTransition(async () => {
      const result = await createListAction({
        boardId: selectedBoardId,
        title: listTitle,
      });
      setStatus(result.message);
      if (result.success && result.data) {
        setListTitle("");
        setLists((prev) => [...prev, result.data!].sort((a, b) => a.order - b.order));
      }
    });
  };

  const handleCreateTask = () => {
    if (!selectedListId) {
      setStatus("Please select a list first");
      return;
    }
    startTransition(async () => {
      const result = await createTaskAction({
        title: taskTitle,
        description: taskDescription,
        listId: selectedListId,
      });
      setStatus(result.message);
      if (result.success && result.data) {
        setTaskTitle("");
        setTaskDescription("");
        setTasks((prev) => [...prev, result.data!].sort((a, b) => a.order - b.order));
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Studio</CardTitle>
          <CardDescription>
            Create and manage Workspace, Board, List, and Task in one flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SelectBox
              label="Workspace"
              value={selectedWorkspaceId}
              onChange={setSelectedWorkspaceId}
              options={workspaces.map((w) => ({ value: w._id, label: w.name }))}
            />
            <SelectBox
              label="Board"
              value={selectedBoardId}
              onChange={setSelectedBoardId}
              options={boards.map((b) => ({ value: b._id, label: b.title }))}
            />
            <SelectBox
              label="List"
              value={selectedListId}
              onChange={setSelectedListId}
              options={lists.map((l) => ({ value: l._id, label: l.title }))}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {message || "Select hierarchy and start creating data."}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CreateCard title="Create Workspace">
          <Input
            placeholder="Workspace name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <Button
            onClick={handleCreateWorkspace}
            disabled={isPending || workspaceName.trim().length < 2}
          >
            Create Workspace
          </Button>
        </CreateCard>

        <CreateCard title="Create Board">
          <Input
            placeholder="Board title"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
          />
          <Button
            onClick={handleCreateBoard}
            disabled={isPending || !selectedWorkspaceId || boardTitle.trim().length < 2}
          >
            Create Board
          </Button>
        </CreateCard>

        <CreateCard title="Create List">
          <Input
            placeholder="List title"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
          />
          <Button
            onClick={handleCreateList}
            disabled={isPending || !selectedBoardId || listTitle.trim().length < 2}
          >
            Create List
          </Button>
        </CreateCard>

        <CreateCard title="Create Task">
          <Input
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <textarea
            className="w-full min-h-24 rounded-md border border-gray-300 p-3 text-sm"
            placeholder="Task description (optional)"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <Button
            onClick={handleCreateTask}
            disabled={isPending || !selectedListId || taskTitle.trim().length < 1}
          >
            Create Task
          </Button>
        </CreateCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <EntityListCard
          title={`Workspaces (${workspaces.length})`}
          items={workspaces.map((w) => w.name)}
          subtitle={selectedWorkspace ? `Selected: ${selectedWorkspace.name}` : ""}
        />
        <EntityListCard
          title={`Boards (${boards.length})`}
          items={boards.map((b) => b.title)}
          subtitle={selectedBoard ? `Selected: ${selectedBoard.title}` : ""}
        />
        <EntityListCard
          title={`Lists (${lists.length})`}
          items={lists.map((l) => l.title)}
          subtitle={selectedList ? `Selected: ${selectedList.title}` : ""}
        />
        <EntityListCard
          title={`Tasks (${tasks.length})`}
          items={tasks.map((t) => t.title)}
        />
      </div>
    </div>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <select
        className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CreateCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function EntityListCard({
  title,
  items,
  subtitle,
}: {
  title: string;
  items: string[];
  subtitle?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items yet</p>
        ) : (
          <ul className="space-y-2">
            {items.slice(0, 6).map((item) => (
              <li key={item} className="text-sm truncate">
                {item}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
