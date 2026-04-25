"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "Use Cases", href: "#use-cases" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* Main Navbar Container */}
      <div
        className={cn(
          "fixed left-0 right-0 top-0 z-50 flex justify-center transition-all duration-500 ease-out",
          isScrolled ? "pt-4" : "pt-6",
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between transition-all duration-500 rounded-2xl w-[95%] max-w-6xl backdrop-blur-md border border-white/20 px-8 py-4 bg-primary-800/60",
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent-500 to-secondary-500 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-7 w-7 rounded-lg bg-gradient-to-br from-accent-400 to-secondary-500 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight transition-all duration-300 text-white">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-white/10",

                  pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-white/80 hover:text-white",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                "text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10",
                pathname === "/login"
                  ? "text-white"
                  : "text-white/80 hover:text-white",
              )}
            >
              Log in
            </Link>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-gradient-to-r from-accent-500 to-secondary-500 px-5 text-white shadow-lg shadow-accent-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-lg bg-white/10 backdrop-blur p-2 text-white transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-0"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay - Slide from right */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-primary-950/70 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 z-50 w-[80%] max-w-sm md:hidden bg-gradient-to-b from-primary-900 to-primary-950 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-400 to-secondary-500 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">TaskFlow</span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 flex flex-col p-6 gap-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 text-base font-medium transition-all duration-300 hover:text-white hover:bg-white/10 rounded-xl",

                      pathname === link.href
                        ? "text-white bg-white/10"
                        : "text-white/80",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px bg-white/10 my-4" />
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-base font-medium text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  Log in
                </Link>
              </div>

              {/* CTA Section */}
              <div className="p-6 border-t border-white/10">
                <Button
                  asChild
                  className="w-full rounded-full bg-gradient-to-r from-accent-500 to-secondary-500 text-white shadow-xl shadow-accent-500/30 transition-all duration-300 hover:scale-105 py-6"
                >
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    Get Started Free
                  </Link>
                </Button>
                <p className="text-center text-xs text-white/40 mt-4">
                  Free forever • No credit card
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
