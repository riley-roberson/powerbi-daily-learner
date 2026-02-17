"use client";

import Link from "next/link";
import { curriculum, tierBg } from "@/lib/curriculum";
import TierBadge from "@/components/TierBadge";
import { useEffect, useState } from "react";

export default function Home() {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    setCompleted(JSON.parse(localStorage.getItem("pbi_completedDays") || "[]"));
  }, []);

  const tiers = [
    {
      name: "Foundation",
      tier: "foundation" as const,
      days: curriculum.filter((d) => d.tier === "foundation"),
      range: "Days 1-10",
      desc: "Data Modeling & Core DAX",
      accent: "#1b365d",
    },
    {
      name: "Builder",
      tier: "builder" as const,
      days: curriculum.filter((d) => d.tier === "builder"),
      range: "Days 11-20",
      desc: "Intermediate DAX Patterns & Visualization",
      accent: "#487a7b",
    },
    {
      name: "Architect",
      tier: "architect" as const,
      days: curriculum.filter((d) => d.tier === "architect"),
      range: "Days 21-30",
      desc: "Advanced DAX, Optimization & Governance",
      accent: "#e87722",
    },
  ];

  const progress = Math.round((completed.length / 30) * 100);

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          Power BI <span className="text-[#e87722]">Intermediate</span> Daily Learner
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          30 days of hands-on Power BI concepts and DAX practice.
          Each day: learn a concept, then write real DAX.
        </p>

        {/* Progress bar */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{completed.length}/30 days completed</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #1b365d, #487a7b, #e87722)`,
              }}
            />
          </div>
        </div>

        <Link
          href="/day/1"
          className="inline-block mt-6 px-6 py-3 bg-[#e87722] hover:bg-[#c5611a] text-white font-semibold rounded-lg transition"
        >
          Start Day 1
        </Link>
      </div>

      {tiers.map((t) => (
        <div key={t.name} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <TierBadge tier={t.tier} />
            <div>
              <h2 className="text-xl font-semibold">{t.name} Tier</h2>
              <p className="text-sm text-gray-400">
                {t.range} &mdash; {t.desc}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {t.days.map((d) => (
              <Link
                key={d.day}
                href={`/day/${d.day}`}
                className={`relative block p-3 rounded-lg border text-center hover:scale-105 transition ${tierBg(d.tier)}`}
              >
                {completed.includes(d.day) && (
                  <span className="absolute top-1 right-1 text-green-400 text-xs">
                    &#10003;
                  </span>
                )}
                <div className="text-2xl font-bold">{d.day}</div>
                <div className="text-xs text-gray-400 mt-1 leading-tight">{d.title}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
