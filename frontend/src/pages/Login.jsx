import { useState } from "react";
import api from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      // Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login successful!");

      // Redirect based on role
      if (res.data.role === "parent") navigate("/parent");
      else if (res.data.role === "teacher") navigate("/teacher");
      else if (res.data.role === "counsellor") navigate("/counsellor");
      else navigate("/admin");

    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="card w-96 bg-base-100 shadow-xl p-7"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          onChange={handleChange}
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-4"
          onChange={handleChange}
        />

        {/* Submit */}
        <button className="btn btn-primary w-full" type="submit">
          Login
        </button>

        <p className="text-center text-sm mt-3">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
