// components/landing/benefits-section.tsx
"use client";

import {
  Brain,
  Users,
  CalendarCheck,
  Sparkles,
  Target,
  Shield,
} from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Banish Mental Clutter",
    description:
      "Capture everything in one place. Our intuitive interface helps you offload tasks immediately, freeing up mental bandwidth for creative work.",
  },
  {
    icon: Users,
    title: "Align Your Team",
    description:
      "Shared boards and real-time updates keep everyone on the same page. No more endless email chains or missed deadlines.",
  },
  {
    icon: CalendarCheck,
    title: "Hit Every Deadline",
    description:
      "Smart reminders and visual progress tracking ensure nothing falls through the cracks. Stay ahead of your commitments effortlessly.",
  },
  {
    icon: Sparkles,
    title: "Zero Learning Curve",
    description:
      "Get started in seconds, not days. Clean design means your team will actually use it, not dread learning another tool.",
  },
  {
    icon: Target,
    title: "Goal-Oriented Planning",
    description:
      "Break down big projects into manageable chunks. Track progress toward your most important objectives at a glance.",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description:
      "Enterprise-grade encryption and compliance standards keep your data safe. Focus on work, not vulnerabilities.",
  },
];

export function BenefitsSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Designed to help you{" "}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              work smarter
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to manage tasks, collaborate with your team, and
            ship projects faster.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-16 grid gap-8 sm:mt-20 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-600">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
