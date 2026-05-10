"use client";

import { ReactNode, useState } from "react";
import { Sheet, SheetContent } from "@/app/components/ui/sheet";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="w-[min(100vw-2rem,18rem)] border-white/[0.06] bg-[#0a0a1a] p-0 [&>button]:right-3 [&>button]:top-4 [&>button]:text-white/60 [&>button]:hover:bg-white/10 [&>button]:hover:text-white"
        >
          <SidebarContent
            user={user}
            onNavClick={() => setMobileNavOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Area: no sidebar offset below lg — fixed overlay menu used instead */}
      <div
        className="flex min-w-0 flex-1 flex-col transition-[padding] duration-300 ease-in-out max-lg:!pl-0"
        style={{ paddingLeft: sidebarWidth }}
      >
        <TopNav onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="min-h-[calc(100vh-64px)] min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
