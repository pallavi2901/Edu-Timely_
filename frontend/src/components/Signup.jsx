// // Signup.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Signup.css';

// export default function Signup({ onAuthSuccess }) {
//   const [form, setForm] = useState({ name: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/signup', form);
//       onAuthSuccess(res.data.userId);
//       navigate('/');
//     } catch (err) {
//       if (err.response && err.response.status === 409) {
//         setError('User already exists! Please login.');
//         setTimeout(() => navigate('/login'), 1500);
//       } else {
//         setError('Something went wrong. Try again.');
//       }
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h2>Create Account</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
//         <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
//         <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
//         <button type="submit">Sign Up</button>
//         {error && <p className="error">{error}</p>}
//       </form>
//       <p>Already have an account? <a href="/login">Login here</a></p>
//     </div>
//   );
// }
// Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Sign Up</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p className='signup-footer'>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}