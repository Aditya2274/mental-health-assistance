// backend/utils/scoring.js
export const calculateRisk = (instrument, totalScore) => {
  if (instrument === "PHQ-A") {
    if (totalScore >= 15) return "high";
    if (totalScore >= 10) return "medium";
    return "low";
  }

  if (instrument === "GAD-7") {
    if (totalScore >= 15) return "high";
    if (totalScore >= 10) return "medium";
    return "low";
  }

  if (instrument === "SDQ") {
    if (totalScore >= 17) return "high";
    if (totalScore >= 14) return "medium";
    return "low";
  }

  return "low";
};
