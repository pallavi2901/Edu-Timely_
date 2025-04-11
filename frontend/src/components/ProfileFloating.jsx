import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import "./ProfileFloating.css";

export default function ProfileFloating({ onLogout }) {
  const [showCard, setShowCard] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:5001/api/auth/user/${userId}`)
        .then((res) => {
          setUserData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    onLogout();
    navigate("/login");
  };

  return (
    <>
      {/* Floating Profile Button */}
      <div className="profile-floating-btn" onClick={() => setShowCard(!showCard)}>
        <FaUserCircle size={35} />
      </div>

      {/* Profile Card */}
      {showCard && (
        <div className="profile-card-popup">
          <div className="profile-header">
            <FaUserCircle size={60} />
            <h3>{loading ? "Loading..." : userData ? userData.name : "No User Found"}</h3>
          </div>
          <p>Email: {userData?.email || "Not Available"}</p>

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  );
}