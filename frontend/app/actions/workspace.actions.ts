// "use server";

// import { revalidatePath } from "next/cache";
// import { workspaceService } from "@/app/services/workspace.service";

// export async function createWorkspaceAction(formData: FormData) {
//   const name = formData.get("name") as string;
  
//   if (!name || !name.trim()) {
//     throw new Error("Workspace name is required");
//   }

//   try {
//     const result = await workspaceService.createWorkspace(name.trim());
//     revalidatePath("/workspaces");
//     return result;
//   } catch (error) {
//     throw new Error(
//       error instanceof Error ? error.message : "Failed to create workspace"
//     );
//   }
// }

// app/actions/workspace.actions.ts
// app/actions/workspace.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/app/lib/auth";
import { workspaceService } from "@/app/services/workspace.service";

export async function createWorkspaceAction(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name?.trim()) {
    throw new Error("Workspace name is required");
  }

  try {
    await requireAuth();

    const result = await workspaceService.createWorkspace(name.trim());

    revalidatePath("/workspaces");

    return {
      success: true,
      workspace: result.workspace,
    };
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create workspace"
    );
  }
}

export async function deleteWorkspaceAction(workspaceId: string) {
  if (!workspaceId?.trim()) {
    throw new Error("Workspace ID is required");
  }

  try {
    const result = await workspaceService.deleteWorkspace(workspaceId);

    revalidatePath("/workspaces");

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete workspace",
    );
  }
}
