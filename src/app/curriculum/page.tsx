"use client";

import Link from "next/link";
import { curriculum, tierBg, tierLabel } from "@/lib/curriculum";
import TierBadge from "@/components/TierBadge";
import { useEffect, useState } from "react";

export default function CurriculumPage() {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    setCompleted(JSON.parse(localStorage.getItem("pbi_completedDays") || "[]"));
  }, []);

  const tiers = [
    { tier: "foundation" as const, range: "Days 1-10", desc: "Data Modeling & Core DAX" },
    { tier: "builder" as const, range: "Days 11-20", desc: "Intermediate DAX Patterns & Visualization" },
    { tier: "architect" as const, range: "Days 21-30", desc: "Advanced DAX, Optimization & Governance" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">30-Day Curriculum</h1>
      <p className="text-gray-400 mb-8">
        {completed.length}/30 completed &mdash; Each day includes a concept lesson and a DAX practice exercise.
      </p>

      {tiers.map((t) => {
        const days = curriculum.filter((d) => d.tier === t.tier);
        return (
          <div key={t.tier} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <TierBadge tier={t.tier} />
              <div>
                <h2 className="text-xl font-semibold">{tierLabel(t.tier)} Tier</h2>
                <p className="text-sm text-gray-400">{t.range} &mdash; {t.desc}</p>
              </div>
            </div>
            <div className="space-y-2">
              {days.map((d) => (
                <Link
                  key={d.day}
                  href={`/day/${d.day}`}
                  className={`flex items-center gap-4 p-3 rounded-lg border hover:scale-[1.01] transition ${tierBg(d.tier)}`}
                >
                  <div className="text-xl font-bold w-10 text-center">{d.day}</div>
                  <div className="flex-1">
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Concept: {d.conceptTopic} &bull; DAX: {d.daxFocus}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap max-w-xs">
                    {d.concepts.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="px-1.5 py-0.5 text-[10px] rounded bg-gray-800/50 border border-gray-700 text-gray-400"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  {completed.includes(d.day) && (
                    <span className="text-green-400 text-sm">&#10003;</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
