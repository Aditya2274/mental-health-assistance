import { useEffect, useState } from "react";
import api from "../../lib/api.js";
import AddChild from "./AddChild.jsx";
import AssessmentForm from "../../components/AssessmentForm.jsx";

export default function ParentDashboard() {
  const [children, setChildren] = useState([]);

  // Fetch children on mount
  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    const res = await api.get("/children/mine");
    setChildren(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Welcome Parent 👋</h2>

      {/* Child Adding Section */}
      <AddChild onAdded={() => loadChildren()} />

      {/* List children */}
      <h3 className="text-xl font-bold mt-6">Your Children</h3>

      {children.length === 0 ? (
        <p>No children yet. Add one!</p>
      ) : (
        children.map((child) => (
          <div key={child._id} className="mt-4 p-4 bg-white shadow rounded">
            <h4 className="font-bold">{child.name}</h4>
            <p>Age: {child.age}</p>
            <p>Grade: {child.grade}</p>

            {/* Assessment Form */}
            <AssessmentForm childId={child._id} />
          </div>
        ))
      )}
    </div>
  );
}
