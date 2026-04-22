import type { Metadata } from "next";
import { KanbanBoardClient } from "@/app/components/boards/kanban-board-client";

export const metadata: Metadata = {
  title: "Boards",
  description: "Board management inside workspaces",
};

export default function BoardsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Boards</h1>
      <KanbanBoardClient />
    </div>
  );
}
