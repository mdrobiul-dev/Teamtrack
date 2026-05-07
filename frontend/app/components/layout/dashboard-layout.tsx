"use client";

import { CSSProperties, ReactNode, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";

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
  const layoutStyle = {
    "--sidebar-width": sidebarWidth,
  } as CSSProperties;

  return (
    <div className="flex min-h-screen bg-background" style={layoutStyle}>
      {/* Desktop Sidebar */}
      <div
        className="fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-width)] overflow-hidden border-r bg-card transition-[width] duration-300 ease-in-out lg:block"
      >
        <SidebarContent 
          user={user} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
      </div>

      {/* Mobile Menu */}
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

      {/* Main Content */}
      <div
        className="min-w-0 flex-1 transition-[padding-left] duration-300 ease-in-out lg:pl-[var(--sidebar-width)]"
      >
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
