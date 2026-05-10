// app/components/workspace/workspace-page-client.tsx
"use client";

import { SparklesIcon } from "lucide-react";
import { useState, useOptimistic } from "react";
import { WorkspaceCard } from "./workspace-card";
import { CreateWorkspaceForm } from "./create-workspace-form";
import type { Workspace } from "@/app/types/workspace";
import { deleteWorkspaceAction } from "@/app/actions/workspace.actions";

type WorkspaceInput = Workspace | { workspace?: Workspace };

function normalizeWorkspace(input: WorkspaceInput): Workspace | null {
  let workspace: Workspace | undefined = undefined;

  if ("workspace" in input) {
    workspace = input.workspace;
  } else {
    workspace = input as Workspace;
  }

  if (!workspace?._id) {
    return null;
  }

  return workspace;
}

export function WorkspacePageDetails({
  initialWorkspaces,
}: {
  initialWorkspaces: Workspace[];
}) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() =>
    initialWorkspaces
      .map((workspace) => normalizeWorkspace(workspace))
      .filter((workspace): workspace is Workspace => Boolean(workspace)),
  );

  const [optimisticWorkspaces] = useOptimistic(
    workspaces,
    (state: Workspace[], newWorkspace: Workspace) => [...state, newWorkspace],
  );

  const handleWorkspaceCreated = (newWorkspace: WorkspaceInput) => {
    const workspace = normalizeWorkspace(newWorkspace);

    if (!workspace) {
      console.error("Created workspace is missing an _id", newWorkspace);
      return;
    }

    setWorkspaces((prev) => [...prev, workspace]);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("Cannot delete workspace without an _id");
      return;
    }

    const workspaceToDelete = workspaces.find((w) => w._id === id);

    setWorkspaces((prev) => prev.filter((w) => w._id !== id));

    try {
      await deleteWorkspaceAction(id);
    } catch (error) {
      if (workspaceToDelete) {
        setWorkspaces((prev) => [...prev, workspaceToDelete]);
      }
      console.error(error);
    }
  };

  const hasWorkspaces = optimisticWorkspaces.length > 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a1a]">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-purple-600/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-purple-500/20 via-pink-500/10 to-cyan-400/20 blur-[120px] animate-pulse delay-1000" />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-300/10 blur-[100px] animate-pulse delay-500" />

      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* Empty State */}
        {!hasWorkspaces && (
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8">
              <SparklesIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Get started with your workspace
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Create Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Workspace
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto">
              Build, organize, and scale your team&apos;s productivity flows
            </p>
          </div>
        )}

        {/* Workspaces Grid */}
        {hasWorkspaces && (
          <div className="mb-12">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
                My Workspaces
              </h2>
              <span className="w-fit text-sm text-white/40 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                {optimisticWorkspaces.length} workspace
                {optimisticWorkspaces.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {optimisticWorkspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace._id}
                  workspace={workspace}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Create Form */}
        <div className={`max-w-lg mx-auto ${hasWorkspaces ? "mt-12" : "mt-8"}`}>
          <CreateWorkspaceForm onSuccess={handleWorkspaceCreated} />
        </div>
      </div>
    </div>
  );
}
