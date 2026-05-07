"use client";

import { ReactNode } from "react";
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
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r bg-card">
        <SidebarContent user={user} />
      </div>

      <Sheet>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="default">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent user={user} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 lg:pl-64">
        <main>{children}</main>
      </div>
    </div>
  );
}
