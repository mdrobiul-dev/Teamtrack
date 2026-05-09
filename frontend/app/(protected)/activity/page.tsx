import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckSquare,
  Circle,
  ClipboardList,
  Filter,
  FolderKanban,
  History,
  Layers3,
  ListChecks,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { requireAuth } from "@/app/lib/auth";
import { activityService } from "@/app/services/activity.service";
import { workspaceService } from "@/app/services/workspace.service";
import type { Activity } from "@/app/types/activity";
import type { Workspace } from "@/app/types/workspace";

export const metadata: Metadata = {
  title: "Activity - TeamTrack",
  description: "Track recent workspace activity across TeamTrack",
};

type ActivityWithWorkspace = Activity & {
  workspaceId: string;
  workspaceName: string;
};

type ActivityPageProps = {
  searchParams?: Promise<{
    workspace?: string;
  }>;
};

const entityStyles: Record<
  string,
  {
    icon: LucideIcon;
    label: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  workspace: {
    icon: FolderKanban,
    label: "Workspace",
    color: "text-cyan-300",
    bg: "bg-cyan-400/[0.08]",
    border: "border-cyan-400/15",
  },
  board: {
    icon: ClipboardList,
    label: "Board",
    color: "text-violet-300",
    bg: "bg-violet-400/[0.08]",
    border: "border-violet-400/15",
  },
  list: {
    icon: ListChecks,
    label: "List",
    color: "text-emerald-300",
    bg: "bg-emerald-400/[0.08]",
    border: "border-emerald-400/15",
  },
  task: {
    icon: CheckSquare,
    label: "Task",
    color: "text-amber-300",
    bg: "bg-amber-400/[0.08]",
    border: "border-amber-400/15",
  },
};

export default async function ActivityPage({ searchParams }: ActivityPageProps) {
  await requireAuth();

  const query = await searchParams;
  const workspaces = await workspaceService.getMyWorkspaces();
  const selectedWorkspaceId =
    query?.workspace && workspaces.some((item) => item._id === query.workspace)
      ? query.workspace
      : "all";
  const activityGroups = await Promise.all(
    workspaces.map(async (workspace) => ({
      workspace,
      activities: await activityService.getWorkspaceActivity(workspace._id),
    })),
  );

  const allActivities = activityGroups
    .flatMap(({ workspace, activities }) =>
      activities.map((activity) => ({
        ...activity,
        workspaceId: workspace._id,
        workspaceName: workspace.name,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const activities =
    selectedWorkspaceId === "all"
      ? allActivities
      : allActivities.filter(
          (activity) => activity.workspaceId === selectedWorkspaceId,
        );
  const visibleWorkspaces =
    selectedWorkspaceId === "all"
      ? workspaces
      : workspaces.filter((workspace) => workspace._id === selectedWorkspaceId);

  const entityCounts = activities.reduce<Record<string, number>>(
    (counts, activity) => {
      counts[activity.entityType] = (counts[activity.entityType] ?? 0) + 1;
      return counts;
    },
    {},
  );
  const activeMembers = new Set(
    activities.map((activity) => getActorName(activity)).filter(Boolean),
  ).size;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a1a]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute right-[-5%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/5 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] h-96 w-96 rounded-full bg-purple-500/5 blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2 text-sm text-white/50">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              <span className="shrink-0 text-white/30">Activity</span>
              <span className="min-w-0 truncate font-medium text-cyan-100/90">
                {selectedWorkspaceId === "all"
                  ? "All workspaces"
                  : getWorkspaceName(workspaces, selectedWorkspaceId)}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white">
              Activity Log
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/35">
              Follow the latest changes from your team across workspaces,
              boards, lists, and tasks.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/60 transition-all hover:border-cyan-400/25 hover:bg-white/[0.06] hover:text-white"
          >
            Open Dashboard
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Activities"
            value={activities.length}
            icon={History}
            accent="text-cyan-300"
          />
          <StatCard
            title="Workspaces"
            value={visibleWorkspaces.length}
            icon={FolderKanban}
            accent="text-violet-300"
          />
          <StatCard
            title="Active Members"
            value={activeMembers}
            icon={Users}
            accent="text-emerald-300"
          />
          <StatCard
            title="Task Events"
            value={entityCounts.task ?? 0}
            icon={CheckSquare}
            accent="text-amber-300"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-cyan-300" />
                <h2 className="text-sm font-semibold text-white/75">
                  Workspace Filter
                </h2>
              </div>

              <div className="space-y-2">
                <WorkspaceFilterLink
                  href="/activity"
                  label="All workspaces"
                  count={allActivities.length}
                  active={selectedWorkspaceId === "all"}
                />
                {workspaces.map((workspace) => (
                  <WorkspaceFilterLink
                    key={workspace._id}
                    href={`/activity?workspace=${workspace._id}`}
                    label={workspace.name}
                    count={countWorkspaceActivities(allActivities, workspace)}
                    active={selectedWorkspaceId === workspace._id}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-cyan-300" />
                <h2 className="text-sm font-semibold text-white/75">
                  Event Types
                </h2>
              </div>

              <div className="space-y-3">
                {Object.entries(entityStyles).map(([type, style]) => (
                  <EntityMetric
                    key={type}
                    label={style.label}
                    value={entityCounts[type] ?? 0}
                    icon={style.icon}
                    color={style.color}
                  />
                ))}
              </div>
            </section>
          </aside>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white/85">
                  Recent Timeline
                </h2>
                <p className="mt-1 text-sm text-white/30">
                  {activities.length
                    ? "Newest workspace changes appear first."
                    : "No activity has been recorded for this view yet."}
                </p>
              </div>
              {activities[0] && (
                <span className="text-xs text-white/25">
                  Last update {formatRelativeTime(activities[0].createdAt)}
                </span>
              )}
            </div>

            {activities.length ? (
              <div className="relative">
                <div className="absolute bottom-0 left-5 top-0 w-px bg-white/[0.06]" />
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <ActivityTimelineItem
                      key={activity._id}
                      activity={activity}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyActivityState hasWorkspaces={workspaces.length > 0} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function ActivityTimelineItem({
  activity,
}: {
  activity: ActivityWithWorkspace;
}) {
  const style = entityStyles[activity.entityType] ?? {
    icon: Circle,
    label: "Event",
    color: "text-white/45",
    bg: "bg-white/[0.04]",
    border: "border-white/[0.08]",
  };
  const Icon = style.icon;

  return (
    <div className="relative flex gap-4 rounded-xl border border-white/[0.06] bg-[#0a0a1a]/50 p-4 transition-all hover:border-cyan-400/20 hover:bg-white/[0.03]">
      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.border} ${style.bg}`}
      >
        <Icon className={`h-5 w-5 ${style.color}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white/85">
              {getActivityDescription(activity)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`rounded-full border px-2.5 py-1 ${style.border} ${style.bg} ${style.color}`}
              >
                {style.label}
              </span>
              <Link
                href={`/workspaces/${activity.workspaceId}`}
                className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-white/35 transition-colors hover:text-cyan-300"
              >
                {activity.workspaceName}
              </Link>
            </div>
          </div>

          <time
            dateTime={activity.createdAt}
            className="shrink-0 text-xs text-white/25"
          >
            {formatRelativeTime(activity.createdAt)}
          </time>
        </div>
      </div>
    </div>
  );
}

function WorkspaceFilterLink({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all ${
        active
          ? "border-cyan-400/20 bg-cyan-400/[0.06] text-white"
          : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:border-cyan-400/20 hover:text-white"
      }`}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span className="shrink-0 rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-white/35">
        {count}
      </span>
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
  icon: LucideIcon;
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

function EntityMetric({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className={`h-4 w-4 shrink-0 ${color}`} />
        <span className="truncate text-sm text-white/55">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white/80">{value}</span>
    </div>
  );
}

function EmptyActivityState({ hasWorkspaces }: { hasWorkspaces: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05]">
        <Sparkles className="h-8 w-8 text-cyan-300/60" />
      </div>
      <h3 className="text-lg font-semibold text-white/65">
        No activity yet
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/30">
        {hasWorkspaces
          ? "Create boards, lists, or tasks and TeamTrack will record those changes here for your team."
          : "Create your first workspace, then activity will appear as your team starts planning work."}
      </p>
      <Link
        href="/workspaces"
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/55 transition-all hover:border-cyan-400/25 hover:text-white"
      >
        {hasWorkspaces ? "Open Workspaces" : "Create Workspace"}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function getActorName(activity: Activity) {
  if (typeof activity.user === "string") return "Someone";
  return activity.user.name || activity.user.email || "Someone";
}

function getActivityDescription(activity: Activity) {
  const actor = getActorName(activity);
  const action = activity.action.toLowerCase();
  const entityLabel =
    entityStyles[activity.entityType]?.label.toLowerCase() || "item";

  if (action.includes("member") && action.includes("added")) {
    return (
      <>
        <span className="text-white">{actor}</span> added a member to the
        workspace
      </>
    );
  }

  if (action.includes("created")) {
    return (
      <>
        <span className="text-white">{actor}</span> created a {entityLabel}
      </>
    );
  }

  if (action.includes("deleted")) {
    return (
      <>
        <span className="text-white">{actor}</span> deleted a {entityLabel}
      </>
    );
  }

  if (action.includes("moved")) {
    return (
      <>
        <span className="text-white">{actor}</span> moved a {entityLabel}
      </>
    );
  }

  if (action.includes("unassigned")) {
    return (
      <>
        <span className="text-white">{actor}</span> unassigned a {entityLabel}
      </>
    );
  }

  if (action.includes("assigned")) {
    return (
      <>
        <span className="text-white">{actor}</span> assigned a {entityLabel}
      </>
    );
  }

  return (
    <>
      <span className="text-white">{actor}</span>{" "}
      {activity.action.replace(/^A\s+/i, "")}
    </>
  );
}

function getWorkspaceName(workspaces: Workspace[], workspaceId: string) {
  return (
    workspaces.find((workspace) => workspace._id === workspaceId)?.name ??
    "Workspace"
  );
}

function countWorkspaceActivities(
  activities: ActivityWithWorkspace[],
  workspace: Workspace,
) {
  return activities.filter((activity) => activity.workspaceId === workspace._id)
    .length;
}

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
