// "use client";

// import Link from "next/link";
// import { Folder, ArrowRight, Users, Calendar } from "lucide-react";
// import type { Workspace } from "@/app/types/workspace";

// interface WorkspaceCardProps {
//   workspace: Workspace;
// }

// export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
//   const createdDate = new Date(workspace.createdAt).toLocaleDateString(
//     "en-US",
//     {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     }
//   );

//   return (
//     <Link
//       href={`/workspaces/${workspace._id}`}
//       className="
//         group bg-white border border-primary-100 rounded-2xl p-6
//         hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/50
//         hover:-translate-y-0.5
//         transition-all duration-300
//         flex flex-col gap-4
//       "
//     >
//       {/* Card Header */}
//       <div className="flex items-start justify-between">
//         <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-300">
//           <Folder className="w-6 h-6 text-primary-600" />
//         </div>
//         <ArrowRight className="w-5 h-5 text-primary-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" />
//       </div>

//       {/* Card Body */}
//       <div className="flex-1">
//         <h3 className="text-lg font-semibold text-primary-800 group-hover:text-primary-900 transition-colors duration-300 line-clamp-1">
//           {workspace.name}
//         </h3>
//         <div className="flex items-center gap-4 mt-2 text-sm text-primary-400">
//           <span className="flex items-center gap-1">
//             <Calendar className="w-4 h-4" />
//             {createdDate}
//           </span>
//           <span className="flex items-center gap-1">
//             <Users className="w-4 h-4" />
//             {workspace.members?.length || 0}
//           </span>
//         </div>
//       </div>

//       {/* Card Footer */}
//       <div className="flex items-center gap-2">
//         <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-50 text-accent-600">
//           Active
//         </span>
//         {workspace.members?.length > 0 && (
//           <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary-50 text-primary-600">
//             {workspace.members.length} member{workspace.members.length !== 1 ? "s" : ""}
//           </span>
//         )}
//       </div>
//     </Link>
//   );
// }

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  LayoutDashboard,
  CheckSquare,
  Trash2,
  X,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import type { Workspace } from "@/app/types/workspace";

interface WorkspaceCardProps {
  workspace: Workspace;
  onDelete?: (id: string) => void;
}

export function WorkspaceCard({ workspace, onDelete }: WorkspaceCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const createdDate = new Date(workspace.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );

  const memberCount = workspace.members?.length || 0;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete?.(workspace._id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <Link
      href={`/workspaces/${workspace._id}`}
      className="group relative w-full rounded-2xl 
                 bg-white/[0.02] backdrop-blur-xl border border-white/8
                 hover:border-cyan-400/30 transition-all duration-500 
                 hover:-translate-y-1 overflow-hidden
                 hover:shadow-lg hover:shadow-cyan-500/5 block"
    >
      {/* Hover gradient effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/0 to-transparent 
                    group-hover:via-cyan-400/20 transition-all duration-700"
      />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 
                          border border-white/5 group-hover:border-cyan-400/20 
                          flex items-center justify-center shrink-0
                          group-hover:from-cyan-500/20 group-hover:to-purple-500/20 
                          transition-all duration-300"
            >
              <LayoutDashboard className="w-5 h-5 text-cyan-400/80 group-hover:text-cyan-400 transition-colors" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-white/90 font-medium truncate group-hover:text-white transition-colors">
                {workspace.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-white/30">Active</span>
                <span className="text-[11px] text-white/20">
                  • {createdDate}
                </span>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          {onDelete &&
            (showDeleteConfirm ? (
              <div className="flex items-center gap-1 ml-2 animate-fade-in">
                <button
                  onClick={handleDeleteClick}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all"
                >
                  Confirm
                </button>
                <button
                  onClick={cancelDelete}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeleteClick}
                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all -mr-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-5" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center">
            <LayoutDashboard className="w-4 h-4 mx-auto text-white/30 mb-1" />
            <div className="text-lg font-semibold text-white/80">0</div>
            <div className="text-[10px] text-white/30">Boards</div>
          </div>

          <div className="text-center">
            <Users className="w-4 h-4 mx-auto text-white/30 mb-1" />
            <div className="text-lg font-semibold text-white/80">
              {memberCount}
            </div>
            <div className="text-[10px] text-white/30">Members</div>
          </div>

          <div className="text-center">
            <CheckSquare className="w-4 h-4 mx-auto text-white/30 mb-1" />
            <div className="text-lg font-semibold text-white/80">0</div>
            <div className="text-[10px] text-white/30">Tasks</div>
          </div>
        </div>

        {/* Open Button */}
        <div
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                      bg-white/[0.03] border border-white/5 hover:border-cyan-400/30
                      text-white/60 hover:text-white transition-all duration-300 text-sm font-medium"
        >
          Open Workspace
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
