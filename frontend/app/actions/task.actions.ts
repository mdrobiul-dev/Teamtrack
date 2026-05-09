"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { taskService } from "@/app/services/task.service";
import type { BoardOption, ListOption, Task, WorkspaceOption } from "@/app/types/task";

const nonEmptyId = z.string().min(1, "ID is required");

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  listId: nonEmptyId,
});

const getTaskByListSchema = z.object({
  listId: nonEmptyId,
});

const getTaskByIdSchema = z.object({
  taskId: nonEmptyId,
});

const assignTaskSchema = z.object({
  taskId: nonEmptyId,
  userId: nonEmptyId,
});

const moveTaskSchema = z.object({
  taskId: nonEmptyId,
  targetListId: nonEmptyId,
});

const unassignTaskSchema = z.object({
  taskId: nonEmptyId,
});

const deleteTaskSchema = z.object({
  taskId: nonEmptyId,
});

const reorderTaskSchema = z.object({
  listId: nonEmptyId,
  items: z
    .array(
      z.object({
        id: nonEmptyId,
        order: z.number(),
      }),
    )
    .min(1, "At least one reorder item is required"),
});

export type TaskActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return "Something went wrong";
};

export async function createTaskAction(input: {
  title: string;
  description?: string;
  listId: string;
}): Promise<TaskActionResult<Task>> {
  try {
    const payload = createTaskSchema.parse(input);
    const task = await taskService.createTask(payload);
    revalidatePath("/tasks-list");
    return { success: true, message: "Task created successfully", data: task };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function getTasksByListAction(input: {
  listId: string;
}): Promise<TaskActionResult<Task[]>> {
  try {
    const payload = getTaskByListSchema.parse(input);
    const tasks = await taskService.getTasksByList(payload.listId);
    return { success: true, message: "Tasks fetched successfully", data: tasks };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function getWorkspacesAction(): Promise<
  TaskActionResult<WorkspaceOption[]>
> {
  try {
    const workspaces = await taskService.getWorkspaces();
    return {
      success: true,
      message: "Workspaces fetched successfully",
      data: workspaces,
    };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function getBoardsByWorkspaceAction(input: {
  workspaceId: string;
}): Promise<TaskActionResult<BoardOption[]>> {
  try {
    const payload = z.object({ workspaceId: nonEmptyId }).parse(input);
    const boards = await taskService.getBoardsByWorkspace(payload.workspaceId);
    return { success: true, message: "Boards fetched successfully", data: boards };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function getListsByBoardAction(input: {
  boardId: string;
}): Promise<TaskActionResult<ListOption[]>> {
  try {
    const payload = z.object({ boardId: nonEmptyId }).parse(input);
    const lists = await taskService.getListsByBoard(payload.boardId);
    return { success: true, message: "Lists fetched successfully", data: lists };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function getTaskByIdAction(input: {
  taskId: string;
}): Promise<TaskActionResult<Task>> {
  try {
    const payload = getTaskByIdSchema.parse(input);
    const task = await taskService.getTaskById(payload.taskId);
    return { success: true, message: "Task fetched successfully", data: task };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function assignTaskAction(input: {
  taskId: string;
  userId: string;
}): Promise<TaskActionResult<Task>> {
  try {
    const payload = assignTaskSchema.parse(input);
    const response = await taskService.assignTask(payload.taskId, {
      userId: payload.userId,
    });
    revalidatePath("/tasks-list");
    return { success: true, message: response.message, data: response.task };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function unassignTaskAction(input: {
  taskId: string;
}): Promise<TaskActionResult<Task>> {
  try {
    const payload = unassignTaskSchema.parse(input);
    const response = await taskService.unassignTask(payload.taskId);
    revalidatePath("/tasks-list");
    return { success: true, message: response.message, data: response.task };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function moveTaskAction(input: {
  taskId: string;
  targetListId: string;
}): Promise<TaskActionResult<Task>> {
  try {
    const payload = moveTaskSchema.parse(input);
    const response = await taskService.moveTask(payload.taskId, {
      targetListId: payload.targetListId,
    });
    revalidatePath("/tasks-list");
    return { success: true, message: response.message, data: response.task };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function reorderTasksAction(input: {
  listId: string;
  items: { id: string; order: number }[];
}): Promise<TaskActionResult> {
  try {
    const payload = reorderTaskSchema.parse(input);
    const response = await taskService.reorderTasks(payload);
    revalidatePath("/tasks-list");
    return { success: true, message: response.message };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function deleteTaskAction(input: {
  taskId: string;
}): Promise<TaskActionResult> {
  try {
    const payload = deleteTaskSchema.parse(input);
    const response = await taskService.deleteTask(payload.taskId);
    revalidatePath("/tasks-list");
    return { success: true, message: response.message };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}
