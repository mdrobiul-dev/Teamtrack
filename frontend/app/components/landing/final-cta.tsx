// components/landing/final-cta.tsx
"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-primary-800 py-24 sm:py-32">
      {/* Animated background circles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Ready to do your best work?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            Join thousands of focused individuals and teams who have reclaimed
            their time with TaskFlow.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="rounded-full bg-accent-500 px-8 py-4.5 text-lg font-semibold text-white shadow-lg shadow-accent-500/40 transition-all hover:bg-accent-600 hover:shadow-xl active:scale-95 h-auto"
            >
              <Link
                href="/signup"
                className="flex items-center whitespace-nowrap"
              >
                Create Your Free Account <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Link href="/demo">Watch Demo →</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-primary-200">
            No credit card required. Start in 30 seconds.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
