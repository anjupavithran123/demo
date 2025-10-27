import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreeDBackground from "../../components/ThreeDBackground";
import api from "../../lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const response = await api.post("auth/login", { email, password });

      if (response.data.success) {
        // Save token in localStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Navigate to workspace page
        // If your backend returns defaultWorkspaceId:
        if (response.data.defaultWorkspaceId) {
          navigate(`/workspace/${response.data.defaultWorkspaceId}`);
        } else {
          // fallback: navigate to a default workspace or dashboard
          navigate("/workspace/1"); // replace "1" with your default ID
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Server error. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      <ThreeDBackground />

      <div className="relative z-10 px-4 py-10 w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white/6 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-3 text-center">
            Login
          </h2>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <label className="block mb-2 text-sm text-white/80">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block mb-2 text-sm text-white/80">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="text-center text-sm text-white/70 mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-300 underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
