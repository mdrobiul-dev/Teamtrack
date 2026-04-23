// components/landing/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-40 transition-all duration-500",
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg"
            : "bg-gradient-to-r from-white/95 via-primary-50/90 to-secondary-50/95 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile, visible on desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary-600 after:to-secondary-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
            <Button
              asChild
              variant="default"
              size="sm"
              className="rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 px-5 text-white shadow-md shadow-primary-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30"
            >
              <Link href="/register">Sign Up</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button - Only visible on mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-lg p-2 text-gray-600 transition-colors hover:bg-white/50 focus:outline-none focus:ring-0"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay - Only visible when menu is open AND on mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-gradient-to-br from-white via-primary-50 to-secondary-50 backdrop-blur-sm">
          <div className="flex flex-col p-4 pt-20">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-primary-100 py-4 text-base font-medium text-gray-900 transition-all duration-300 hover:translate-x-2 hover:text-primary-600 focus:outline-none focus:ring-0"
              >
                {link.name}
              </Link>
            ))}
            <Button
              asChild
              className="mt-6 w-full rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-0"
            >
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}