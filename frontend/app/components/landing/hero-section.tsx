// components/landing/hero-section.tsx
"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-gray-50/40 to-white pb-20 pt-30 sm:pt-38 lg:pt-40">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary-100/30 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-secondary-50 px-3 py-1 text-sm font-medium text-secondary-700 ring-1 ring-inset ring-secondary-200">
              🚀 Trusted by 10,000+ teams
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Organize your work.{" "}
            <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              Reclaim your focus.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl"
          >
            The lightweight task manager designed to help freelancers, students,
            and small teams turn chaos into clarity.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              className="rounded-full bg-accent-500 px-8 py-4.5 text-lg font-semibold text-white shadow-lg shadow-accent-500/30 transition-all hover:bg-accent-600 hover:shadow-xl active:scale-95 h-auto"
            >
              <Link href="/register">
                Start for Free{" "}
                <ArrowRight className="ml-2 h-5 w-5 inline-block" />
              </Link>
            </Button>
          </motion.div>

          {/* Microcopy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 text-sm text-gray-500"
          >
            No credit card required • Setup in 30 seconds
          </motion.p>

          {/* Hero Image / Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 overflow-hidden rounded-2xl ring-1 ring-gray-200 lg:mt-20"
          >
            <Image
              src="/task-2.jpg"
              alt="TaskFlow dashboard interface showing organized tasks and team collaboration"
              width={1200}
              height={800}
              className="w-full object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
