"use client";

import Link from "next/link";
import { Folder, ArrowRight, Users, Calendar } from "lucide-react";
import type { Workspace } from "@/app/types/workspace";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const createdDate = new Date(workspace.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Link
      href={`/workspaces/${workspace._id}`}
      className="
        group bg-white border border-primary-100 rounded-2xl p-6
        hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/50
        hover:-translate-y-0.5
        transition-all duration-300
        flex flex-col gap-4
      "
    >
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-300">
          <Folder className="w-6 h-6 text-primary-600" />
        </div>
        <ArrowRight className="w-5 h-5 text-primary-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" />
      </div>

      {/* Card Body */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-primary-800 group-hover:text-primary-900 transition-colors duration-300 line-clamp-1">
          {workspace.name}
        </h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-primary-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {createdDate}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {workspace.members?.length || 0}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-50 text-accent-600">
          Active
        </span>
        {workspace.members?.length > 0 && (
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary-50 text-primary-600">
            {workspace.members.length} member{workspace.members.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </Link>
  );
}