"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { workspaceService } from "@/app/services/workspace.service";
import type { Workspace } from "@/app/types/workspace";

type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
});

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) return error.message;
  return "Something went wrong";
};

export async function getMyWorkspacesAction(): Promise<ActionResult<Workspace[]>> {
  try {
    const data = await workspaceService.getMyWorkspaces();
    return { success: true, message: "Workspaces loaded", data };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

export async function createWorkspaceAction(input: {
  name: string;
}): Promise<ActionResult<Workspace>> {
  try {
    const payload = createWorkspaceSchema.parse(input);
    const result = await workspaceService.createWorkspace(payload.name);
    revalidatePath("/workspaces");
    return {
      success: true,
      message: result.message || "Workspace created",
      data: result.workspace,
    };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}
