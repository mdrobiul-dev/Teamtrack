// components/landing/social-proof.tsx
"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";

const companies = [
  { name: "Vercel", logo: "/vercel.svg" },
  { name: "Cursor", logo: "/cursor.svg" },
  { name: "Hermes", logo: "/hermesagent.svg" },
  { name: "Notion", logo: "/notion.svg" },
  { name: "ElevenLabs", logo: "/elevenlabs.svg" },
  { name: "Figma", logo: "/figma.svg" },
];

export function SocialProof() {
  return (
    <section className="border-y border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-gray-400">
          Trusted by industry leaders
        </p>
        <div className="mt-8">
          <Marquee
            gradient={false}
            speed={50}
            pauseOnHover
            className="overflow-hidden"
          >
            <div className="flex items-center gap-12 sm:gap-16">
              {companies.map((company) => (
                <div
                  key={company.name}
                  className="flex-shrink-0 grayscale transition-all hover:grayscale-0"
                >
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain opacity-60 transition-opacity hover:opacity-100"
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {companies.map((company) => (
                <div
                  key={`${company.name}-duplicate`}
                  className="flex-shrink-0 grayscale hover:grayscale-0"
                >
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain opacity-60 transition-opacity hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  );
}
