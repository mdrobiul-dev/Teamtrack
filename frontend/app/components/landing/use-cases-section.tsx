"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  BookOpen,
  Briefcase,
  Users as UsersIcon,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

const useCases = {
  students: {
    title: "For Students",
    icon: BookOpen,
    description:
      "Master your coursework and stay ahead of deadlines with intelligent task prioritization.",
    features: [
      "Assignment tracking with automatic reminders",
      "Focus mode to block distractions",
      "Group project collaboration boards",
      "Grade and progress analytics",
    ],
    image: "/task_student.jpg",
  },
  freelancers: {
    title: "For Freelancers",
    icon: Briefcase,
    description:
      "Manage multiple clients effortlessly and get paid faster with integrated time tracking.",
    features: [
      "Client project separation",
      "Built-in time blocking",
      "Invoice generation from tasks",
      "Workload capacity planner",
    ],
    image: "/task_freelancer.jpg",
  },
  teams: {
    title: "For Teams",
    icon: UsersIcon,
    description:
      "Streamline communication and ship features faster with lightweight agile workflows.",
    features: [
      "Shared team boards",
      "Role-based access control",
      "Real-time sync & comments",
      "Sprint planning templates",
    ],
    image: "/task_team.jpg",
  },
};

export function UseCasesSection() {
  const [activeCase, setActiveCase] =
    useState<keyof typeof useCases>("students");

  // Get the current icon component
  const CurrentIcon = useCases[activeCase].icon;

  return (
    <section id="use-cases" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built for the way{" "}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              you work
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Whether you&apos;re a student, freelancer, or part of a growing team
            — TaskFlow adapts to your workflow.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 sm:mt-16">
          {Object.entries(useCases).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActiveCase(key as keyof typeof useCases)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                activeCase === key
                  ? "bg-white text-primary-600 shadow-sm ring-1 ring-primary-200"
                  : "text-gray-500 hover:bg-white/60 hover:text-gray-700",
              )}
            >
              <value.icon className="h-4 w-4" />
              {value.title}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 sm:mt-12">
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8 lg:gap-12">
            {/* Left: Text Content */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary-100 p-2 text-secondary-600">
                  <CurrentIcon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {useCases[activeCase].title}
                </h3>
              </div>
              <p className="mt-4 text-gray-600">
                {useCases[activeCase].description}
              </p>
              <ul className="mt-6 space-y-3">
                {useCases[activeCase].features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="outline"
                className="mt-8 w-fit rounded-full border-primary-200 text-primary-600 hover:bg-primary-50"
              >
                <a href="/signup">Start with {useCases[activeCase].title} →</a>
              </Button>
            </div>

            {/* Right: Image */}
            <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={useCases[activeCase].image}
                alt={`TaskFlow interface for ${useCases[activeCase].title.toLowerCase()}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
