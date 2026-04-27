"use server";

import { revalidatePath } from "next/cache";
import { workspaceService } from "@/app/services/workspace.service";

export async function createWorkspaceAction(formData: FormData) {
  const name = formData.get("name") as string;
  
  if (!name || !name.trim()) {
    throw new Error("Workspace name is required");
  }

  try {
    const result = await workspaceService.createWorkspace(name.trim());
    revalidatePath("/workspaces");
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create workspace"
    );
  }
}