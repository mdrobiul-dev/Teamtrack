"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { listService } from "@/app/services/list.service";
import type { List } from "@/app/types/workspace";

type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

const getListsSchema = z.object({
  boardId: z.string().min(1, "Board ID is required"),
});

const createListSchema = z.object({
  boardId: z.string().min(1, "Board ID is required"),
  title: z.string().min(2, "List title must be at least 2 characters"),
});

const deleteListSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  boardId: z.string().min(1, "Board ID is required"),
  listId: z.string().min(1, "List ID is required"),
});

const reorderListsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number(),
      }),
    )
    .min(1, "At least one item is required"),
});

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) return error.message;
  return "Something went wrong";
};

export async function getListsByBoardAction(input: {
  boardId: string;
}): Promise<ActionResult<List[]>> {
  try {
    const payload = getListsSchema.parse(input);
    const data = await listService.getListsByBoard(payload.boardId);
    return { success: true, message: "Lists loaded", data };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function createListAction(input: {
  boardId: string;
  title: string;
}): Promise<ActionResult<List>> {
  try {
    const payload = createListSchema.parse(input);
    const data = await listService.createList(payload.boardId, payload.title);
    revalidatePath("/workspaces");
    return { success: true, message: "List created", data };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function deleteListAction(input: {
  workspaceId: string;
  boardId: string;
  listId: string;
}): Promise<ActionResult<{ listId: string }>> {
  try {
    const payload = deleteListSchema.parse(input);
    const data = await listService.deleteList(payload.listId);
    revalidatePath(`/workspaces/${payload.workspaceId}/boards/${payload.boardId}`);
    return {
      success: true,
      message: data.message,
      data: { listId: data.listId },
    };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function reorderListsAction(input: {
  items: { id: string; order: number }[];
}): Promise<ActionResult> {
  try {
    const payload = reorderListsSchema.parse(input);
    const result = await listService.reorderLists(payload.items);
    revalidatePath("/boards");
    return { success: true, message: result.message || "Lists reordered" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}
