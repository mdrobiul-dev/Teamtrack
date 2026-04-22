import type { Metadata } from "next";
import { TaskManagerClient } from "@/app/components/tasks/task-manager-client";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Manage task controllers from frontend",
};

export default function TasksPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Tasks</h1>
      <TaskManagerClient />
    </div>
  );
}
