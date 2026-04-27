import { Metadata } from "next";
import { Suspense } from "react";
import { requireAuth } from "@/app/lib/auth";
import { DashboardClient } from "@/app/components/dashboard/dashboard-client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard - TeamTrack",
  description: "Your TeamTrack dashboard",
};

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-800 tracking-tight">
          Welcome back, {session.name}!
        </h1>
        <p className="mt-2 text-primary-500">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/workspaces"
          className="bg-white border border-primary-100 rounded-2xl p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary-800 mb-2">
            Workspaces
          </h3>
          <p className="text-primary-500 text-sm">
            Manage your workspaces and team collaboration
          </p>
          <ArrowRight className="w-5 h-5 text-primary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300 mt-4" />
        </Link>

        <Link
          href="/boards"
          className="bg-white border border-primary-100 rounded-2xl p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-accent-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary-800 mb-2">
            Boards
          </h3>
          <p className="text-primary-500 text-sm">
            View and manage your project boards
          </p>
          <ArrowRight className="w-5 h-5 text-primary-400 group-hover:text-accent-600 group-hover:translate-x-1 transition-all duration-300 mt-4" />
        </Link>

        <Link
          href="/tasks"
          className="bg-white border border-primary-100 rounded-2xl p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-secondary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary-800 mb-2">
            Tasks
          </h3>
          <p className="text-primary-500 text-sm">
            Track and manage your team's tasks
          </p>
          <ArrowRight className="w-5 h-5 text-primary-400 group-hover:text-secondary-600 group-hover:translate-x-1 transition-all duration-300 mt-4" />
        </Link>
      </div>

      {/* Dashboard Content */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[40vh]">
            <p className="text-primary-400">Loading your dashboard...</p>
          </div>
        }
      >
        <DashboardClient user={session} />
      </Suspense>
    </div>
  );
}