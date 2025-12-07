// frontend/src/pages/Counsellor/AssessmentReview.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";

export default function AssessmentReview() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [notes, setNotes] = useState({ note: "", actionPlan: "", followUpDate: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    try {
      const res = await api.get(`/counsellor/assessment/${id}`);
      setAssessment(res.data.assessment);
    } catch (err) {
      console.error("load assessment", err);
      alert("Failed to load assessment");
    }
  };

  const handleChange = (e) => setNotes({ ...notes, [e.target.name]: e.target.value });

  const saveNote = async (e) => {
    e.preventDefault();
    if (!assessment) return;
    setSaving(true);
    try {
      await api.post("/counsellor/casenote", {
        childId: assessment.childId._id,
        assessmentId: assessment._id,
        note: notes.note,
        actionPlan: notes.actionPlan,
        followUpDate: notes.followUpDate || null
      });
      alert("Case note saved");
      setNotes({ note: "", actionPlan: "", followUpDate: "" });
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
      load();
    }
  };

  if (!assessment) return <p className="p-6">Loading assessment...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Assessment Review</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="font-bold">{assessment.childId?.name}</div>
        <div className="text-sm text-gray-500">{assessment.instrument} • Score: {assessment.totalScore} • Risk: {assessment.riskLevel}</div>

        <div className="mt-4">
          <h4 className="font-medium">Responses</h4>
          <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">{JSON.stringify(assessment.responses, null, 2)}</pre>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Add Case Note / Action Plan</h3>

        <form onSubmit={saveNote} className="space-y-3">
          <textarea name="note" value={notes.note} onChange={handleChange} className="textarea textarea-bordered w-full" placeholder="Clinical note / observations" required />
          <textarea name="actionPlan" value={notes.actionPlan} onChange={handleChange} className="textarea textarea-bordered w-full" placeholder="Action plan / recommendations" />
          <input type="date" name="followUpDate" value={notes.followUpDate} onChange={handleChange} className="input input-bordered w-full" />
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Case Note"}</button>
        </form>
      </div>
    </div>
  );
}
