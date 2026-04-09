"use client";

import { useState, useRef, useEffect } from "react";

export default function ScoringRulesPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Scoring Rules"
        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition"
        title="How Scoring Works"
      >
        {/* Book/rules icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <path
            d="M4 3C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H6C6.55228 17 7 16.5523 7 16V4C7 3.44772 6.55228 3 6 3H4Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M9 3C8.44772 3 8 3.44772 8 4V16C8 16.5523 8.44772 17 9 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H9Z"
            fill="currentColor"
          />
          <rect x="10" y="6" width="5" height="1.5" rx="0.75" fill="#12141a" />
          <rect x="10" y="9" width="5" height="1.5" rx="0.75" fill="#12141a" />
          <rect x="10" y="12" width="3" height="1.5" rx="0.75" fill="#12141a" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Slide-out panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#12141a] border-l border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-[#e87722]">Scoring Rules</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-[calc(100%-60px)] px-5 py-5 space-y-6">
          {/* Intro */}
          <p className="text-sm text-gray-400 leading-relaxed">
            Think of this as the rulebook. Here&apos;s exactly how your DAX submissions
            are evaluated and what best practices we look for.
          </p>

          {/* How scoring works */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#487a7b] mb-3">
              How Your Score Is Calculated
            </h3>
            <div className="space-y-3">
              <div className="bg-[#1a1d24] border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-200">Pattern Matching</span>
                  <span className="text-xs font-bold text-[#e87722]">60%</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Each challenge requires specific DAX functions and keywords. We check
                  whether your code includes them (case-insensitive). For example, if a
                  challenge requires <code className="text-[#e87722]">CALCULATE</code> and{" "}
                  <code className="text-[#e87722]">ALL</code>, both must appear in your code
                  to get full marks in this category.
                </p>
              </div>

              <div className="bg-[#1a1d24] border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-200">Keyword Similarity</span>
                  <span className="text-xs font-bold text-[#e87722]">40%</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your code is compared against the reference solution for structural similarity.
                  We extract significant keywords from the solution and check how many appear in
                  your submission. This rewards code that follows the intended approach without
                  requiring an exact match.
                </p>
              </div>

              <div className="bg-[#1a1d24] border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-200">Final Score</span>
                  <span className="text-xs font-bold text-[#e87722]">0 &ndash; 100</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  <code className="text-[#487a7b]">(Pattern Match x 0.6) + (Keyword Similarity x 0.4)</code>
                  <br />
                  Both components are scored 0&ndash;100, then combined with their weights.
                </p>
              </div>
            </div>
          </section>

          {/* Score tiers */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#487a7b] mb-3">
              Score Tiers
            </h3>
            <div className="space-y-2">
              {[
                { range: "90 \u2013 100", label: "Excellent", color: "#487a7b", desc: "All key patterns covered. You nailed it." },
                { range: "70 \u2013 89", label: "Good", color: "#5a9a9b", desc: "Most patterns present. Review the missing items to level up." },
                { range: "40 \u2013 69", label: "On Track", color: "#e87722", desc: "Right direction, but key patterns are missing. Use hints." },
                { range: "0 \u2013 39", label: "Keep Going", color: "#c5611a", desc: "Review the lesson and hints, then try again." },
              ].map((tier) => (
                <div key={tier.range} className="flex items-start gap-3 py-2">
                  <span
                    className="text-xs font-mono font-bold whitespace-nowrap mt-0.5 min-w-[64px] text-right"
                    style={{ color: tier.color }}
                  >
                    {tier.range}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-gray-200">{tier.label}</span>
                    <p className="text-xs text-gray-400">{tier.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Passing & completion */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#487a7b] mb-3">
              Passing & Completion
            </h3>
            <div className="bg-[#1a1d24] border border-gray-700/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[#487a7b] mt-0.5">&#10003;</span>
                <p className="text-xs text-gray-400">
                  <span className="text-gray-200 font-semibold">Score 70+</span> automatically
                  marks the day as complete.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#487a7b] mt-0.5">&#10003;</span>
                <p className="text-xs text-gray-400">
                  <span className="text-gray-200 font-semibold">Manual completion</span> &mdash;
                  you can also check the &ldquo;Mark as complete&rdquo; box on any day, regardless of score.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#487a7b] mt-0.5">&#10003;</span>
                <p className="text-xs text-gray-400">
                  <span className="text-gray-200 font-semibold">Resubmit anytime</span> &mdash;
                  there&apos;s no penalty for multiple attempts. Keep iterating.
                </p>
              </div>
            </div>
          </section>

          {/* DAX best practices */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#487a7b] mb-3">
              DAX Best Practices We Look For
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: "Use VAR / RETURN",
                  detail: "Store intermediate values in variables for readability and performance. Variables are evaluated once and capture filter context at the point of definition.",
                },
                {
                  title: "Use DIVIDE() for Safe Division",
                  detail: "Never use the / operator for division in measures. DIVIDE() handles divide-by-zero gracefully without IFERROR wrappers.",
                },
                {
                  title: "Use the Right Function for the Job",
                  detail: "Each challenge specifies which DAX functions to use (e.g., CALCULATE, ALL, TOTALYTD). Using the correct function demonstrates understanding of the concept.",
                },
                {
                  title: "Reference the Correct Tables & Columns",
                  detail: "DAX requires explicit table and column references like Sales[TotalAmount]. Using the correct model references shows you understand the data model.",
                },
                {
                  title: "Follow the Intended Pattern",
                  detail: "There are often multiple ways to solve a DAX problem. We check for the specific pattern being taught that day (e.g., CALCULATE + ALL for % of total) to confirm concept understanding.",
                },
                {
                  title: "Write Production-Quality DAX",
                  detail: "Clean formatting, meaningful variable names, and proper nesting. The reference solution models the quality we're looking for.",
                },
              ].map((bp) => (
                <div key={bp.title} className="bg-[#1a1d24] border border-gray-700/50 rounded-lg p-3">
                  <span className="text-sm font-semibold text-gray-200">{bp.title}</span>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{bp.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What the improvements list means */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#487a7b] mb-3">
              Reading Your Results
            </h3>
            <div className="bg-[#1a1d24] border border-gray-700/50 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm font-semibold text-gray-200">Missing Patterns</span>
                <p className="text-xs text-gray-400 mt-1">
                  After submitting, you&apos;ll see a list of required patterns your code
                  is missing. Each one names a specific function or keyword the challenge
                  expects. Add them to improve your pattern match score.
                </p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-200">Hints</span>
                <p className="text-xs text-gray-400 mt-1">
                  Progressive hints go from general to specific. Use them before
                  revealing the full solution.
                </p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-200">Reference Solution</span>
                <p className="text-xs text-gray-400 mt-1">
                  The solution shows one correct approach. Your code doesn&apos;t need to
                  match it exactly &mdash; just include the key patterns and functions.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>
    </>
  );
}
