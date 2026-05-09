"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  ArrowUpRight,
  CheckSquare,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
import type { AssignedUser } from "@/app/types/task";
import type { User } from "@/app/types/auth";
import { logout } from "@/app/actions/auth.actions";

export type DashboardBoard = {
  _id: string;
  title: string;
  workspaceId: string;
  workspaceName: string;
  listCount: number;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
};

export type DashboardTask = {
  _id: string;
  title: string;
  listId: string;
  listTitle: string;
  boardId: string;
  boardTitle: string;
  workspaceId: string;
  workspaceName: string;
  assignedTo: string | AssignedUser | null;
  createdAt: string;
  updatedAt: string;
};

type RecentWorkspace = {
  _id: string;
  name: string;
  boardCount: number;
  memberCount: number;
  updatedAt: string;
};

interface DashboardClientProps {
  user: User;
  stats: {
    workspaces: number;
    boards: number;
    lists: number;
    tasks: number;
    members: number;
  };
  recentWorkspaces: RecentWorkspace[];
  recentBoards: DashboardBoard[];
  recentTasks: DashboardTask[];
}

export function DashboardClient({
  user,
  stats,
  recentWorkspaces,
  recentBoards,
  recentTasks,
}: DashboardClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#0a0a1a]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2 text-sm text-white/50">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              <span className="shrink-0 text-white/30">Dashboard</span>
              <span className="min-w-0 truncate font-medium text-cyan-100/90">
                Live workspace overview
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white">
              Welcome back, {user.name}
            </h1>
            <p className="mt-2 text-sm text-white/35">
              Your workspaces, boards, lists, and tasks are all in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <DashboardAction href="/workspaces" label="New Workspace" />
            <DashboardAction href="/boards" label="Open Boards" />
            <DashboardAction href="/tasks-list" label="Task Lists" />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Workspaces"
            value={stats.workspaces}
            icon={FolderKanban}
            accent="text-cyan-300"
          />
          <StatCard
            title="Boards"
            value={stats.boards}
            icon={ClipboardList}
            accent="text-violet-300"
          />
          <StatCard
            title="Lists"
            value={stats.lists}
            icon={ListChecks}
            accent="text-emerald-300"
          />
          <StatCard
            title="Tasks"
            value={stats.tasks}
            icon={CheckSquare}
            accent="text-amber-300"
          />
          <StatCard
            title="Members"
            value={stats.members}
            icon={Users}
            accent="text-pink-300"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel
            title="Recent Workspaces"
            actionHref="/workspaces"
            actionLabel="View all"
          >
            {recentWorkspaces.length ? (
              <div className="space-y-3">
                {recentWorkspaces.map((workspace) => (
                  <Link
                    key={workspace._id}
                    href={`/workspaces/${workspace._id}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-cyan-400/25 hover:bg-white/[0.04]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                        <FolderKanban className="h-5 w-5 text-cyan-300/80" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-white/85 group-hover:text-white">
                          {workspace.name}
                        </h3>
                        <p className="mt-1 text-xs text-white/30">
                          {workspace.boardCount} boards /{" "}
                          {workspace.memberCount} members
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-white/25">
                      {formatDate(workspace.updatedAt)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyPanel
                icon={FolderKanban}
                title="No workspaces yet"
                body="Create your first workspace to begin organizing boards, lists, and tasks."
                href="/workspaces"
                cta="Create Workspace"
              />
            )}
          </Panel>

          <Panel title="Profile" actionHref="/settings" actionLabel="Settings">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-2xl font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-white/90">
                    {user.name}
                  </h3>
                  <p className="truncate text-sm text-white/35">{user.email}</p>
                  <p className="mt-1 text-xs text-white/25">
                    Member since{" "}
                    {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-400/15 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-300 transition-all hover:border-red-400/25 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {isPending ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </Panel>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Panel title="Active Boards" actionHref="/boards" actionLabel="Boards">
            {recentBoards.length ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {recentBoards.map((board) => (
                  <Link
                    key={board._id}
                    href={`/workspaces/${board.workspaceId}/boards/${board._id}`}
                    className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-cyan-400/25 hover:bg-white/[0.04]"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-white/85 group-hover:text-white">
                          {board.title}
                        </h3>
                        <p className="mt-1 truncate text-xs text-white/30">
                          {board.workspaceName}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <MiniMetric label="Lists" value={board.listCount} />
                      <MiniMetric label="Tasks" value={board.taskCount} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyPanel
                icon={ClipboardList}
                title="No boards yet"
                body="Open a workspace and create a board to start planning work."
                href="/workspaces"
                cta="Choose Workspace"
              />
            )}
          </Panel>

          <Panel
            title="Recent Tasks"
            actionHref="/tasks-list"
            actionLabel="Task lists"
          >
            {recentTasks.length ? (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <Link
                    key={task._id}
                    href={`/workspaces/${task.workspaceId}/boards/${task.boardId}`}
                    className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-cyan-400/25 hover:bg-white/[0.04]"
                  >
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-white/30 group-hover:text-cyan-300" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium text-white/85 group-hover:text-white">
                        {task.title}
                      </h3>
                      <p className="mt-1 truncate text-xs text-white/30">
                        {task.listTitle} / {task.boardTitle}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-white/25">
                      {formatDate(task.updatedAt)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyPanel
                icon={CheckSquare}
                title="No tasks yet"
                body="Create a list inside a board, then add tasks to track the work."
                href="/boards"
                cta="Open Boards"
              />
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function DashboardAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/60 transition-all hover:border-cyan-400/25 hover:bg-white/[0.06] hover:text-white"
    >
      <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
      {label}
    </Link>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: number;
  icon: typeof LayoutDashboard;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2">
          <Icon className={`h-5 w-5 ${accent}`} />
        </div>
        <span className="text-xs text-white/25">Live</span>
      </div>
      <div className="text-3xl font-semibold text-white/90">{value}</div>
      <p className="mt-1 text-sm text-white/35">{title}</p>
    </div>
  );
}

function Panel({
  title,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  actionHref: string;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white/85">{title}</h2>
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-sm text-white/35 transition-colors hover:text-cyan-300"
        >
          {actionLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      {children}
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-center">
      <div className="text-lg font-semibold text-white/80">{value}</div>
      <div className="text-[10px] text-white/30">{label}</div>
    </div>
  );
}

function EmptyPanel({
  icon: Icon,
  title,
  body,
  href,
  cta,
}: {
  icon: typeof LayoutDashboard;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-10 text-center">
      <Icon className="mb-4 h-10 w-10 text-white/20" />
      <h3 className="text-sm font-medium text-white/60">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/25">
        {body}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/55 transition-all hover:border-cyan-400/25 hover:text-white"
      >
        {cta}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
