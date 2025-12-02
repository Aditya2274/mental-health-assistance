import { useState } from "react";
import api from "../../lib/api";

export default function AddChild({ onAdded }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    grade: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/children/add", form);
      alert("Child added successfully!");

      if (onAdded) onAdded(res.data.child);

      // clear form
      setForm({ name: "", age: "", grade: "" });
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add child");
    }
  };

  return (
    <div className="p-4 bg-base-200 rounded mt-4 shadow">
      <h3 className="font-bold mb-3 text-lg">Add Child</h3>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          placeholder="Child Name"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="age"
          value={form.age}
          placeholder="Age"
          type="number"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="grade"
          value={form.grade}
          placeholder="Grade"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary w-full" type="submit">
          Add Child
        </button>
      </form>
    </div>
  );
}
