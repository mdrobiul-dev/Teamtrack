// "use client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { Plus, Loader2 } from "lucide-react";
// import { createWorkspaceAction } from "../../actions/workspace.actions";

// export function CreateWorkspaceForm() {
//   const [name, setName] = useState("");
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name.trim() || isPending) return;

//     setError(null);

//     // Create FormData for server action
//     const formData = new FormData();
//     formData.append("name", name.trim());

//     startTransition(async () => {
//       try {
//         await createWorkspaceAction(formData);
//         setName("");
//         router.refresh();
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Failed to create workspace",
//         );
//       }
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mb-8">
//       <div className="bg-white border border-primary-100 rounded-2xl p-6 shadow-sm">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1">
//             <input
//               type="text"
//               name="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter workspace name..."
//               disabled={isPending}
//               className="
//                 w-full px-4 py-3 bg-primary-50/50 border border-primary-100 rounded-xl
//                 text-primary-800 placeholder-primary-400
//                 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
//                 transition-all duration-200
//                 disabled:opacity-50 disabled:cursor-not-allowed
//               "
//             />
//             {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
//           </div>
//           <button
//             type="submit"
//             disabled={isPending || !name.trim()}
//             className="
//               inline-flex items-center justify-center gap-2 px-6 py-3
//               bg-primary-800 text-white font-semibold rounded-xl
//               hover:bg-primary-700
//               focus:outline-none focus:ring-2 focus:ring-primary-500/20
//               disabled:opacity-50 disabled:cursor-not-allowed
//               transition-all duration-200
//               whitespace-nowrap h-[50px]
//             "
//           >
//             {isPending ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               <>
//                 <Plus className="w-5 h-5" />
//                 Create Workspace
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }

// Inside CreateWorkspaceForm
// app/components/workspace/create-workspace-form.tsx
"use client";

import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { createWorkspaceAction } from "@/app/actions/workspace.actions";

interface CreateWorkspaceFormProps {
  onSuccess?: (newWorkspace: any) => void;
}

export function CreateWorkspaceForm({ onSuccess }: CreateWorkspaceFormProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim() || isLoading) return;

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", workspaceName.trim());

    try {
      const result = await createWorkspaceAction(formData);

      if (result.success && result.workspace) {
        onSuccess?.(result.workspace);
        setWorkspaceName("");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create workspace");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-purple-500/0 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition duration-700" />

        <div className="relative rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/8 p-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Workspace name"
              className="flex-1 bg-transparent text-white/90 placeholder:text-white/30 
                         border-0 outline-none text-base py-3 px-4"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!workspaceName.trim() || isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl
                         bg-white/5 hover:bg-white/10 border border-white/10 
                         hover:border-cyan-400/40 disabled:opacity-50
                         text-white/70 hover:text-white transition-all active:scale-[0.97]"
            >
              {isLoading ? "Creating..." : "Create"}
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {error && (
        <p className="text-red-400 text-sm text-center mt-3">{error}</p>
      )}

      <p className="text-center text-xs text-white/30 mt-4">
        Press{" "}
        <kbd className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px]">
          Enter
        </kbd>{" "}
        to create
      </p>
    </div>
  );
}
