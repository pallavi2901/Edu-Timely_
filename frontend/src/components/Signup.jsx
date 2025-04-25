import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'react-lottie';
import robotAnimationData from '../assets/login.json';
import './Signup.css';

export default function Signup({ onAuthSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5001/api/auth/signup', form);
      onAuthSuccess(res.data.userId);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('User already exists! Please login.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError('Something went wrong. Try again.');
      }
    }
  };

  const robotOptions = {
    loop: true,
    autoplay: true,
    animationData: robotAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="signup-page-wrapper">
  <div className="signup-card">
    <div className="robot-signup">
      <Lottie options={robotOptions} height={300} width={300} />
    </div>

    <div className="signup-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Sign Up</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p className="signup-footer">Already have an account? <a href="/login" className="login-link">Login here</a></p>
    </div>
  </div>
</div>

  );
}
