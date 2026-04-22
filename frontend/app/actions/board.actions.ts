"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { boardService } from "@/app/services/board.service";
import type { Board } from "@/app/types/workspace";

type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

const getBoardsSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

const createBoardSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  title: z.string().min(2, "Board title must be at least 2 characters"),
});

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) return error.message;
  return "Something went wrong";
};

export async function getBoardsByWorkspaceAction(input: {
  workspaceId: string;
}): Promise<ActionResult<Board[]>> {
  try {
    const payload = getBoardsSchema.parse(input);
    const data = await boardService.getBoardsByWorkspace(payload.workspaceId);
    return { success: true, message: "Boards loaded", data };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function createBoardAction(input: {
  workspaceId: string;
  title: string;
}): Promise<ActionResult<Board>> {
  try {
    const payload = createBoardSchema.parse(input);
    const data = await boardService.createBoard(payload.workspaceId, payload.title);
    revalidatePath("/workspaces");
    return { success: true, message: "Board created", data };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}
