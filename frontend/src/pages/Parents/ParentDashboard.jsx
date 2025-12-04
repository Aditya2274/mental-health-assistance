import { useEffect, useState } from "react";
import api from "../../lib/api.js";
import AddChild from "./AddChild.jsx";
import AssessmentForm from "../../components/AssessmentForm.jsx";

export default function ParentDashboard() {
  const [children, setChildren] = useState([]);

  // Fetch children on mount
  useEffect(() => {
    loadChildren();
    fetchChildren();
  }, []);

  const loadChildren = async () => {
    const res = await api.get("/children/mine");
    const list = Array.isArray(res.data) ? res.data : res.data.children || [];
    setChildren(list);  //here we are setting list because from backend is set as array
  };
  const fetchChildren = async () => {
  const res = await api.get("/children/mine");
  const list = res.data.children;
  
    // Fetch assessments for each child
    const childrenWithAssessments = await Promise.all(
      list.map(async (child) => {
        const a = await api.get(`/assessment/child/${child._id}`);
        return { ...child, assessments: a.data.assessments };
      })
    );
  
    setChildren(childrenWithAssessments);
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
            {child.assessments && child.assessments.length > 0 ? (
             <div className="mt-3 text-sm">
             <  h4 className="font-semibold mb-1">Assessments:</h4>
         
             {child.assessments.map(a => (
               <div key={a._id} className="border rounded p-2 mb-2 bg-gray-50">
                 <div className="font-medium">{a.instrument}</div>
                 <div>Score: {a.totalScore}</div>
                 <div>Risk: {a.riskLevel}</div>
                 <div>Date: {new Date(a.createdAt).toLocaleDateString()}</div>
               </div>
              ))}
             </div>
             ) : (
              <p className="text-sm text-gray-500 mt-2">No assessments yet.</p>
             )}
            {/* Assessment Form */}
            <AssessmentForm childId={child._id} />
          </div>
        ))
      )}
    </div>
  );
}
