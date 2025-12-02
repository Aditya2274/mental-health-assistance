import { useState } from "react";
import api from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "parent"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      alert("Account created successfully!");
      navigate("/");  // go to login
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="card w-96 bg-base-100 shadow-xl p-7"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="select select-bordered w-full mb-4"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
          <option value="counsellor">Counsellor</option>
        </select>

        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>

        <p className="text-center text-sm mt-3">
          Already have an account?{" "}
          <Link to="/" className="text-primary underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
