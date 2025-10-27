import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ThreeDBackground from "../../components/ThreeDBackground";
import api from "../../lib/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {

      const response = await api.post("/auth/signup", { name, email, password });

      if (response.data?.success || response.status === 200) {
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }
        if (response.data?.defaultWorkspaceId) {
          nav(`/workspace/${response.data.defaultWorkspaceId}`);
        } else {
          alert("Signup successful!");
          nav("/");
        }
      } else {
        setError(response.data?.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-900">
      {/* 3D animated background behind */}
      <ThreeDBackground />

      {/* Card container */}
      <div className="relative z-10 w-full max-w-md px-6 py-10">
        <form
          onSubmit={handleSignup}
          className="bg-white/6 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-4">
            Create account
          </h2>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <label className="block text-sm text-white/80 mb-1">Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 mb-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-sm text-white/80 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mb-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-sm text-white/80 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-4 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-green-500/80 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          <div className="mt-4 text-center text-sm text-white/70">
            <span className="mr-2">Already have an account?</span>
            <Link to="/" className="text-blue-300 underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
