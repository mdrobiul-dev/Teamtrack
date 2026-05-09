"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  CheckSquare,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTransition, useState } from "react";
import { logout } from "@/app/actions/auth.actions";
import { cn } from "@/app/lib/utils";

interface SidebarContentProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export function SidebarContent({ 
  user, 
  isCollapsed: externalCollapsed, 
  setIsCollapsed: externalSetCollapsed 
}: SidebarContentProps) {
  
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Use external state (from layout) on desktop, internal for mobile
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setIsCollapsed = externalSetCollapsed || setInternalCollapsed;

  const navigation = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Workspaces", href: "/workspaces", icon: FolderKanban },
    { title: "Boards", href: "/boards", icon: ClipboardList },
    { title: "Tasks", href: "/tasks-list", icon: CheckSquare },
    { title: "Activity", href: "/activity", icon: History  },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  const isActiveRoute = (href: string) => {
    if (pathname === href) return true;
    if (href !== "/" && pathname.startsWith(href + "/")) return true;
    return false;
  };

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden bg-[#0a0a1a]/90 backdrop-blur-2xl border-r border-white/[0.06] transition-all duration-300">
      {/* Logo + Toggle */}
      <div
        className={cn(
          "relative flex h-16 items-center border-b border-white/[0.06] px-5 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              TeamTrack
            </span>
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/[0.08] transition-all lg:block hidden"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex min-w-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]",
                    isCollapsed && "justify-center px-3"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyan-400 rounded-r" />
                  )}

                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-cyan-400" : "text-white/50 group-hover:text-white/80"
                  )} />

                  {!isCollapsed && <span className="min-w-0 truncate">{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Area */}
      <div className="min-w-0 overflow-hidden border-t border-white/[0.06] p-4">
        <div className={cn("flex min-w-0 items-center gap-3 rounded-xl p-2 hover:bg-white/[0.04]", 
          isCollapsed && "justify-center"
        )}>
          <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-white/40 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => startTransition(async () => logout())}
                disabled={isPending}
                className="flex-shrink-0 p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
