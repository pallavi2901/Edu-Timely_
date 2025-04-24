import { useState } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function Login({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (res.status === 200 && res.data?.userId) {
        const { userId, token } = res.data;

        // Store userId and token safely
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);

        console.log("UserId saved:", userId); // Debugging
        console.log("Token saved:", token); // Debugging

        onAuthSuccess(userId);
        navigate("/dashboard"); // Redirect after login
      } else {
        console.error("Login response missing userId:", res.data);
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p className="login-footer">
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
}