"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useTransition } from "react";
import { logout } from "@/app/actions/auth.actions";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";

interface SidebarContentProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workspaces", href: "/workspaces", icon: FolderKanban },
  { name: "Boards", href: "/boards", icon: ClipboardList },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function SidebarContent({ user }: SidebarContentProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          TeamTrack
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startTransition(async () => logout())}
          disabled={isPending}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isPending ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  );
}
