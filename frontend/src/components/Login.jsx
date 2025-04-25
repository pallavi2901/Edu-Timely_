import { useState } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import robotAnimationData from '../assets/login.json';
import "./LoginPage.css";

export default function Login({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (res.status === 200 && res.data?.userId) {
        const { userId, token } = res.data;
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
        onAuthSuccess(userId);
        navigate("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const robotOptions = {
    loop: true,
    autoplay: true,
    animationData: robotAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="robot-login">
          <Lottie options={robotOptions} height={300} width={300} />
        </div>

        <div className="login-container">
          <h2>Welcome Back</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span className="password-toggle" onClick={togglePassword}>
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
            <button type="submit">Login</button>
          </form>
          <p className="login-footer">
            Don't have an account? <a href="/signup" className="signup-link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

