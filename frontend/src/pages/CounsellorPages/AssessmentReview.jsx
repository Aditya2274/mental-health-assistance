import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AssessmentReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  // prevent invalid or undefined IDs
  if (!id || id === "null" || id === "undefined") {
    console.log("Invalid ID in URL:", id);
    setError("Invalid assessment ID");
    setLoading(false);
    return;
  }

  console.log("Final Assessment ID:", id);

  const fetchAssessment = async () => {
    try {
      const res = await api.get(`/assessment/${id}`);

      if (!res.data || !res.data.assessment) {
        setError("Assessment not found.");
      } else {
        setAssessment(res.data.assessment);
      }

    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load assessment");
    } finally {
      setLoading(false);
    }
  };

  fetchAssessment();
}, [id]);


  if (loading) return <div>Loading assessment...</div>;

  if (error)
    return (
      <div className="alert alert-error">
        <p>{error}</p>
        <button className="btn btn-sm" onClick={() => navigate("/counsellor/students")}>
          Go back
        </button>
      </div>
    );

  if (!assessment) return <div>Assessment not found</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Assessment Review</h2>
      <div className="card bg-base-100 shadow">
        <div className="card-body">

          <h3 className="font-bold text-xl">
            {assessment.childId?.name || "Child"}
          </h3>

          <p>Instrument: {assessment.instrument}</p>
          <p>Total Score: {assessment.totalScore}</p>
          <p>Risk Level: {assessment.riskLevel}</p>

          <h4 className="font-semibold mt-4">Responses:</h4>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(assessment.responses, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
