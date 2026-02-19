"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import TierBadge from "@/components/TierBadge";
import { getDayInfo } from "@/lib/curriculum";
import { getChallenge, Challenge } from "@/lib/challenges";
import { validateCode, ValidationResult } from "@/lib/validate";

export default function DayPageClient() {
  const params = useParams();
  const dayNum = Number(params.n);
  const dayInfo = getDayInfo(dayNum);
  const challenge: Challenge | undefined = getChallenge(dayNum);

  const [code, setCode] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode);
      setResult(null);
      setShowHints(false);
      setShowSolution(false);
    }
  }, [dayNum, challenge]);

  function handleSubmit() {
    if (!challenge) return;
    const validation = validateCode(code, challenge.solution, challenge.validationRules);
    setResult(validation);

    if (validation.correct) {
      const stored = JSON.parse(localStorage.getItem("pbi_completedDays") || "[]");
      if (!stored.includes(dayNum)) {
        stored.push(dayNum);
        localStorage.setItem("pbi_completedDays", JSON.stringify(stored));
      }
    }
  }

  if (!dayInfo || !challenge) {
    return <div className="text-center py-20 text-gray-400">Day {dayNum} not found.</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {dayNum > 1 && (
            <Link href={`/day/${dayNum - 1}`} className="text-gray-500 hover:text-gray-300">
              &larr; Day {dayNum - 1}
            </Link>
          )}
          <h1 className="text-2xl font-bold">Day {dayNum}</h1>
          <TierBadge tier={dayInfo.tier} />
          {dayNum < 30 && (
            <Link href={`/day/${dayNum + 1}`} className="text-gray-500 hover:text-gray-300">
              Day {dayNum + 1} &rarr;
            </Link>
          )}
        </div>
        <button
          onClick={() => {
            setCode(challenge.starterCode);
            setResult(null);
          }}
          className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition"
        >
          Reset Code
        </button>
      </div>

      <div className="space-y-6">
        {/* Title & Concepts */}
        <div>
          <h2 className="text-xl font-semibold mb-2">{challenge.title}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {dayInfo.concepts.map((c) => (
              <span
                key={c}
                className="px-2 py-0.5 text-xs rounded bg-gray-800 border border-gray-700 text-gray-300"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* CONCEPT OF THE DAY */}
        <div className="border-l-4 border-[#1b365d] pl-4">
          <h3 className="text-sm font-semibold text-[#5a8abf] uppercase tracking-wider mb-3">
            Concept of the Day &mdash; {dayInfo.conceptTopic}
          </h3>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-4">
            {challenge.conceptLesson}
          </div>
          {challenge.conceptKeyTakeaways.length > 0 && (
            <div className="p-3 rounded-lg bg-[#1b365d]/10 border border-[#1b365d]/30">
              <h4 className="text-xs font-semibold text-[#5a8abf] uppercase mb-2">
                Key Takeaways
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {challenge.conceptKeyTakeaways.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Power BI Notes */}
        {challenge.powerBINotes && (
          <div className="p-3 rounded-lg bg-[#487a7b]/10 border border-[#487a7b]/30 text-[#7abcbd] text-sm">
            <strong>Power BI Tip:</strong> {challenge.powerBINotes}
          </div>
        )}

        {/* DAX PRACTICE */}
        <div className="border-l-4 border-[#487a7b] pl-4">
          <h3 className="text-sm font-semibold text-[#7abcbd] uppercase tracking-wider mb-3">
            DAX Practice &mdash; {dayInfo.daxFocus}
          </h3>

          <div className="text-gray-300 text-sm leading-relaxed mb-3">
            <strong className="text-gray-200">Scenario:</strong> {challenge.daxScenario}
          </div>

          <div className="text-gray-400 text-sm leading-relaxed mb-3 whitespace-pre-line">
            {challenge.daxInstructions}
          </div>

          <div className="p-2 rounded bg-gray-900/50 border border-gray-800 text-xs text-gray-500 mb-4">
            <strong>Model context:</strong> {challenge.sampleModel}
          </div>
        </div>

        {/* Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Your DAX
            </h3>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#e87722] hover:bg-[#c5611a] text-white font-semibold rounded-lg transition"
            >
              Submit
            </button>
          </div>
          <CodeEditor value={code} onChange={setCode} />
        </div>

        {/* Expected Output */}
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Expected Output
          </h3>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap">
            {challenge.expectedOutput}
          </pre>
        </div>

        {/* Validation Result */}
        {result && (
          <div
            className={`p-4 rounded-lg border ${
              result.correct
                ? "bg-[#487a7b]/10 border-[#487a7b]"
                : "bg-[#e87722]/10 border-[#e87722]"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{result.correct ? "\u2713" : "\u2717"}</span>
              <span
                className="font-semibold"
                style={{ color: result.correct ? "#487a7b" : "#e87722" }}
              >
                Score: {result.score}/100
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-2">{result.feedback}</p>
            {result.improvements?.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                {result.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Hints & Solution */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowHints(!showHints)}
            className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition"
          >
            {showHints ? "Hide Hints" : "Show Hints"}
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition"
          >
            {showSolution ? "Hide Solution" : "Show Solution"}
          </button>
        </div>

        {showHints && challenge.hints?.length > 0 && (
          <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 space-y-2">
            {challenge.hints.map((hint, i) => (
              <p key={i} className="text-sm text-gray-300">
                <span className="text-[#e87722] font-semibold">Hint {i + 1}:</span> {hint}
              </p>
            ))}
          </div>
        )}

        {showSolution && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Solution
            </h3>
            <CodeEditor value={challenge.solution} onChange={() => {}} readOnly />
          </div>
        )}

        {/* Video */}
        {challenge.videoUrl && (() => {
          const match = challenge.videoUrl!.match(/[?&]v=([^&]+)/);
          const videoId = match ? match[1] : null;
          return videoId ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Video Lesson
              </h3>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Video Lesson"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}
