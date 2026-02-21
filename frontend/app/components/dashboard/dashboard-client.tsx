'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { useAuth } from '@/app/hooks/use-auth';
import type { User } from '@/app/types/auth';

interface DashboardClientProps {
  user: User;
  // Optional: pass real stats from server later
  stats?: {
    workspaces: number;
    boards: number;
    tasks: number;
    members: number;
  };
}

export function DashboardClient({ user, stats }: DashboardClientProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  // Placeholder stats (replace with real data from server action / API later)
  const defaultStats = stats ?? {
    workspaces: 3,
    boards: 12,
    tasks: 24,
    members: 8,
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl p-6 md:p-8 text-white shadow-sm">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Welcome back, {user.name}! 👋
        </h2>
        <p className="text-blue-100 text-sm md:text-base">
          Here&apos;s what&apos;s happening with your workspaces today.
        </p>
      </div>

      {/* Stats Grid – more responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Workspaces" value={defaultStats.workspaces} change="+2 from last month" />
        <StatCard title="Active Boards" value={defaultStats.boards} change="4 in progress" />
        <StatCard title="Pending Tasks" value={defaultStats.tasks} change="8 due this week" />
        <StatCard title="Team Members" value={defaultStats.members} change="+3 new this month" />
      </div>

      {/* Recent Activity + Tasks – grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentWorkspaces />
        <YourTasks />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.push('/workspace/new')}>Create Workspace</Button>
            <Button variant="outline" onClick={() => router.push('/board/new')}>New Board</Button>
            <Button variant="outline" onClick={() => router.push('/tasks/new')}>Create Task</Button>
            <Button variant="outline" onClick={() => router.push('/invite')}>Invite Team</Button>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Card */}
      <Card className="bg-muted/40">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground/80 mt-1">
                  Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Stat Card (extracted for cleanliness)
function StatCard({ title, value, change }: { title: string; value: number; change: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{change}</p>
      </CardContent>
    </Card>
  );
}

// Placeholder components (make dynamic later)
function RecentWorkspaces() {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Workspaces</CardTitle>
        <CardDescription>Your most recently accessed workspaces</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              onClick={() => router.push(`/workspace/${i}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
                  W{i}
                </div>
                <div>
                  <h4 className="font-medium">Workspace {i}</h4>
                  <p className="text-sm text-muted-foreground">Last active 2 hours ago</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">3 boards</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function YourTasks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
        <CardDescription>Tasks assigned to you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { title: 'Update project documentation', priority: 'High', due: 'Today' },
            { title: 'Review pull requests', priority: 'Medium', due: 'Tomorrow' },
            { title: 'Team meeting', priority: 'Low', due: 'Wednesday' },
          ].map((task, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded border-input" />
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">Due: {task.due}</p>
                </div>
              </div>
              <span
                className={`
                  px-2.5 py-0.5 text-xs font-medium rounded-full
                  ${task.priority === 'High' ? 'bg-destructive/10 text-destructive' : ''}
                  ${task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                  ${task.priority === 'Low' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                `}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}