import { Zap } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Pricing", href: "/pricing" },
    { name: "Changelog", href: "/changelog" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  Resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Help Center", href: "/help" },
    { name: "Community", href: "/community" },
    { name: "Status", href: "/status" },
  ],
  Legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "Cookies", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
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
            <p className="text-sm text-primary-200">
              Organize your work. Reclaim your focus.
            </p>
            <p className="text-xs text-primary-300">
              © {new Date().getFullYear()} TaskFlow, Inc.
            </p>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 xl:col-span-2 xl:mt-0">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-200">
                  {category}
                </h3>
                <ul className="mt-4 space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-primary-300 transition-colors hover:text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
