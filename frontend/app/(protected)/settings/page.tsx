import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle2,
  FolderKanban,
  Lock,
  LogOut,
  Mail,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logout } from "@/app/actions/auth.actions";
import { requireAuth } from "@/app/lib/auth";
import { workspaceService } from "@/app/services/workspace.service";

export const metadata: Metadata = {
  title: "Settings - TeamTrack",
  description: "Manage your TeamTrack account settings",
};

export default async function SettingsPage() {
  const user = await requireAuth();
  const workspaces = await workspaceService.getMyWorkspaces();
  const ownedWorkspaces = workspaces.filter(
    (workspace) => workspace.owner === user.id,
  ).length;
  const memberWorkspaces = Math.max(workspaces.length - ownedWorkspaces, 0);
  const memberCount = new Set(
    workspaces.flatMap((workspace) => [
      workspace.owner,
      ...(workspace.members?.map((member) => member.user) ?? []),
    ]),
  ).size;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a1a]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute right-[-5%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/5 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] h-96 w-96 rounded-full bg-purple-500/5 blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2 text-sm text-white/50">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              <span className="shrink-0 text-white/30">Settings</span>
              <span className="min-w-0 truncate font-medium text-cyan-100/90">
                Account and workspace preferences
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white">
              Settings
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/35">
              Keep the account essentials visible without turning this into a
              control room.
            </p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-400/15 bg-red-500/5 px-5 py-2.5 text-sm font-medium text-red-300 transition-all hover:border-red-400/25 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-2xl font-semibold text-white">
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold text-white/90">
                    {user.name}
                  </h2>
                  <p className="mt-1 truncate text-sm text-white/35">
                    {user.email}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1 text-xs text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active account
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <MiniMetric label="Workspaces" value={workspaces.length} />
                <MiniMetric label="Members" value={memberCount} />
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
              <h2 className="mb-4 text-sm font-semibold text-white/75">
                Account Snapshot
              </h2>
              <div className="space-y-3">
                <SnapshotRow
                  icon={Calendar}
                  label="Member since"
                  value={user.createdAt ? formatDate(user.createdAt) : "N/A"}
                />
                <SnapshotRow
                  icon={FolderKanban}
                  label="Owned workspaces"
                  value={ownedWorkspaces.toString()}
                />
                <SnapshotRow
                  icon={Users}
                  label="Joined workspaces"
                  value={memberWorkspaces.toString()}
                />
              </div>
            </section>
          </aside>

          <main className="space-y-6">
            <SettingsPanel
              title="Profile"
              description="Your visible identity across TeamTrack."
            >
              <SettingRow
                icon={UserRound}
                label="Display name"
                value={user.name}
                status="Connected"
              />
              <SettingRow
                icon={Mail}
                label="Email address"
                value={user.email}
                status="Connected"
              />
              <PlannedRow
                icon={UserRound}
                label="Edit profile"
                value="Add a backend profile update endpoint before enabling this."
              />
            </SettingsPanel>

            <SettingsPanel
              title="Security"
              description="Simple account security controls."
            >
              <SettingRow
                icon={Shield}
                label="Session"
                value="Protected by access and refresh tokens"
                status="Active"
              />
              <PlannedRow
                icon={Lock}
                label="Change password"
                value="Planned for when the backend supports password updates."
              />
              <div className="rounded-xl border border-red-400/10 bg-red-500/[0.03] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-red-200/90">
                      Sign out of this device
                    </h3>
                    <p className="mt-1 text-sm text-white/30">
                      Ends your current TeamTrack session.
                    </p>
                  </div>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-300 transition-all hover:border-red-400/25 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </SettingsPanel>

            <SettingsPanel
              title="Workspace Preferences"
              description="A few useful shortcuts based on your current workspace access."
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SummaryCard label="Total" value={workspaces.length} />
                <SummaryCard label="Owned" value={ownedWorkspaces} />
                <SummaryCard label="Joined" value={memberWorkspaces} />
              </div>

              <Link
                href="/workspaces"
                className="group flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-cyan-400/25 hover:bg-white/[0.04]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-cyan-400/[0.06]">
                    <FolderKanban className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-white/80">
                      Manage workspaces
                    </h3>
                    <p className="mt-1 text-xs text-white/30">
                      Create, open, or organize your workspaces.
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300" />
              </Link>
            </SettingsPanel>

            <SettingsPanel
              title="Notifications"
              description="Keep this quiet until notification delivery exists."
            >
              <PlannedRow
                icon={Bell}
                label="Email notifications"
                value="Can be enabled later for task assignments and workspace activity."
              />
            </SettingsPanel>
          </main>
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white/85">{title}</h2>
        <p className="mt-1 text-sm text-white/30">{description}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SettingRow({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  status: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-white/80">{label}</h3>
          <p className="mt-1 truncate text-sm text-white/35">{value}</p>
        </div>
      </div>
      <span className="w-fit shrink-0 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1 text-xs text-emerald-300">
        {status}
      </span>
    </div>
  );
}

function PlannedRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-white/[0.01] p-4 opacity-80 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <Icon className="h-5 w-5 text-white/35" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-white/60">{label}</h3>
          <p className="mt-1 text-sm text-white/25">{value}</p>
        </div>
      </div>
      <span className="w-fit shrink-0 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-white/35">
        Planned
      </span>
    </div>
  );
}

function SnapshotRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-cyan-300" />
        <span className="truncate text-sm text-white/50">{label}</span>
      </div>
      <span className="shrink-0 text-sm font-medium text-white/80">
        {value}
      </span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
      <div className="text-2xl font-semibold text-white/85">{value}</div>
      <div className="mt-1 text-xs text-white/30">{label}</div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="text-2xl font-semibold text-white/85">{value}</div>
      <p className="mt-1 text-sm text-white/30">{label}</p>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
