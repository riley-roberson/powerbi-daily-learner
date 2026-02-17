export interface ValidationResult {
  correct: boolean;
  score: number;
  feedback: string;
  improvements: string[];
  patternResults: { rule: string; passed: boolean }[];
}

export function validateCode(
  code: string,
  solution: string,
  validationRules: { type: string; value: string }[]
): ValidationResult {
  const patternResults = (validationRules || []).map((rule) => {
    if (rule.type === "contains") {
      return { rule: rule.value, passed: code.toLowerCase().includes(rule.value.toLowerCase()) };
    }
    return { rule: rule.value, passed: true };
  });

  const passed = patternResults.filter((r) => r.passed).length;
  const total = patternResults.length;
  const patternScore = total > 0 ? Math.round((passed / total) * 100) : 0;

  // Basic similarity check against solution
  const solutionKeywords = solution
    .replace(/[#\n\r\/]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const matchedKeywords = solutionKeywords.filter((kw) =>
    code.toLowerCase().includes(kw.toLowerCase())
  );
  const similarity =
    solutionKeywords.length > 0
      ? Math.round((matchedKeywords.length / solutionKeywords.length) * 100)
      : 0;

  const score = Math.round(patternScore * 0.6 + Math.min(similarity, 100) * 0.4);

  let feedback: string;
  if (score >= 90) {
    feedback = "Excellent work! Your DAX covers all the key patterns perfectly.";
  } else if (score >= 70) {
    feedback = "Good job! Your DAX hits most of the important patterns. Review the missing items below.";
  } else if (score >= 40) {
    feedback = "You're on the right track. Check the hints and try to include the missing patterns.";
  } else {
    feedback = "Keep going! Review the lesson and hints, then try incorporating the expected patterns.";
  }

  const improvements = patternResults
    .filter((r) => !r.passed)
    .map((r) => `Missing pattern: ${r.rule}`);

  return {
    patternResults,
    correct: score >= 70,
    score,
    feedback,
    improvements,
  };
}
