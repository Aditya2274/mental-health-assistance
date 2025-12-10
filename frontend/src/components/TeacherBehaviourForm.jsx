// src/components/TeacherBehaviourForm.jsx
import { useState } from "react";
import api from "@/lib/api";

export default function TeacherBehaviourForm({ childId, onSubmitted }) {
  const [responses, setResponses] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const questions = [
    { id: "b1", text: "Participates in class" },
    { id: "b2", text: "Shows attention to instructions" },
    { id: "b3", text: "Interacts positively with peers" },
    { id: "b4", text: "Completes classwork" },
    { id: "b5", text: "Shows emotional regulation" }
  ];

  const handleChange = (id, value) => {
    const updated = { ...responses, [id]: Number(value) };
    setResponses(updated);
    setTotalScore(Object.values(updated).reduce((a, b) => a + (b || 0), 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/teacher/assessment", {
        childId,
        responses,
        totalScore
      });
      alert("Behaviour assessment submitted");
      setResponses({});
      setTotalScore(0);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 rounded shadow space-y-3">
      <h4 className="font-semibold">Teacher behaviour assessment</h4>
      {questions.map(q => (
        <div key={q.id}>
          <label className="block text-sm">{q.text}</label>
          <select className="input input-bordered w-full mt-1"
                  value={responses[q.id] ?? ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}>
            <option value="">Select</option>
            <option value={0}>0 - Not observed</option>
            <option value={1}>1 - Rarely</option>
            <option value={2}>2 - Sometimes</option>
            <option value={3}>3 - Often</option>
            <option value={4}>4 - Almost always</option>
          </select>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <div className="font-medium">Score: {totalScore}</div>
        <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
