"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { createWorkspaceAction } from "../../actions/workspace.actions";

export function CreateWorkspaceForm() {
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isPending) return;

    setError(null);

    // Create FormData for server action
    const formData = new FormData();
    formData.append("name", name.trim());

    startTransition(async () => {
      try {
        await createWorkspaceAction(formData);
        setName("");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create workspace",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="bg-white border border-primary-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workspace name..."
              disabled={isPending}
              className="
                w-full px-4 py-3 bg-primary-50/50 border border-primary-100 rounded-xl
                text-primary-800 placeholder-primary-400
                focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="
              inline-flex items-center justify-center gap-2 px-6 py-3
              bg-primary-800 text-white font-semibold rounded-xl
              hover:bg-primary-700
              focus:outline-none focus:ring-2 focus:ring-primary-500/20
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              whitespace-nowrap h-[50px]
            "
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Workspace
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );     
}                 
