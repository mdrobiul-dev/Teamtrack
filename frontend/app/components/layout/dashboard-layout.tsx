"use client";

import { CSSProperties, ReactNode, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";
import { TopNav } from "../../components/layout/TopNav";

interface DashboardLayoutProps {
  children: ReactNode;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarWidth = isCollapsed ? "80px" : "288px";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div
        className="fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-r bg-card transition-[width] duration-300 ease-in-out lg:block"
        style={{ width: sidebarWidth }}
      >
        <SidebarContent 
          user={user} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
      </div>

      {/* Mobile Sidebar Trigger */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="default">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent user={user} />
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <div 
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
        style={{ paddingLeft: sidebarWidth }}
      >
        {/* Top Navigation */}
        <TopNav />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
