"use client";

import { useState } from "react";
import { Search, Bell, Sun, Moon, Command } from "lucide-react";
import { cn } from "../../lib/utils";

export function TopNav() {
  const [isDark, setIsDark] = useState(false);
  const [notifications] = useState(4);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#0a0a1a]/90 backdrop-blur-2xl px-6">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <div
          className={cn(
            "absolute inset-y-0 left-3 flex items-center gap-2 pointer-events-none transition-all",
            isSearchFocused ? "text-cyan-400" : "text-white/50",
          )}
        >
          <Search className="h-4 w-4" />
        </div>
        <input
          type="search"
          placeholder="Search..."
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="w-full rounded-xl border border-white/10 bg-white/10 py-2 pl-10 pr-20 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all duration-300 focus:border-cyan-400/30 focus:bg-white/[0.05] focus:ring-2 focus:ring-cyan-400/10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5">
          <kbd className="px-1.5 py-0.5 text-[10px] rounded-md bg-white/[0.05] border border-white/[0.08] text-white/20 font-mono">
            <Command className="h-2.5 w-2.5 inline-block mr-0.5" />K
          </kbd>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all group"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px] transition-transform group-hover:rotate-90" />
          ) : (
            <Moon className="h-[18px] w-[18px] transition-transform group-hover:-rotate-12" />
          )}
        </button>

        <div className="h-5 w-px bg-white/10 mx-2" />

        <button className="relative rounded-xl p-2 text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all group">
          <Bell className="h-[18px] w-[18px]" />
          {notifications > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-medium text-[#0a0a1a] ring-2 ring-[#0a0a1a]">
              {notifications}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}