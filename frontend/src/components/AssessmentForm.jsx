import { useState } from "react";
import api from "../lib/api";

export default function AssessmentForm({ childId }) {
  const [responses, setResponses] = useState({});
  const [totalScore, setTotalScore] = useState(0);

  const questions = [
    { id: "q1", text: "Feels sad often" },
    { id: "q2", text: "Has difficulty concentrating" },
    { id: "q3", text: "Feels anxious frequently" }
  ];

  const handleChange = (id, value) => {
    const updated = { ...responses, [id]: Number(value) };
    setResponses(updated);
    setTotalScore(Object.values(updated).reduce((a, b) => a + b, 0));
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post("/assessment/submit", {
        childId,
        instrument: "PHQ-A",
        responses,
        totalScore,
      });

      alert("Assessment submitted successfully");
    } catch (err) {
      alert("Submission failed: " + err.message);
    }
  };

  return (
    <div>
      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <label className="block font-medium">{q.text}</label>
          <select
            className="border p-2 rounded w-full"
            onChange={(e) => handleChange(q.id, e.target.value)}
          >
            <option value="0">0 - Not at all</option>
            <option value="1">1 - Several days</option>
            <option value="2">2 - More than half</option>
            <option value="3">3 - Nearly daily</option>
          </select>
        </div>
      ))}

      <p className="font-semibold mb-3">Total Score: {totalScore}</p>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
