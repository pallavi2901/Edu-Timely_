import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import "./Home.css";
import robotAnimationData from "../assets/robot-animation.json";
import capAnimationData from "../assets/cap-animation.json"; // Your graduation cap Lottie JSON

export default function Home() {
  const [showCreatorDetails, setShowCreatorDetails] = useState(false);
  const navigate = useNavigate();

  const handleRobotClick = () => {
    setShowCreatorDetails(!showCreatorDetails);
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: robotAnimationData, // Robot animation data
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }  
  const capOptions = {
    loop: true,
    autoplay: true,
    animationData: capAnimationData, 
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="home-container">
      {/* Title & Cap Animation */}
      <div className="title-container">
        <h1 className="title">
          Welcome to <span>EDU-TIMELY</span>
        </h1>
        <span className="cap-animation">
          <Lottie options={capOptions} height={100} width={100} className="lottiecap" />
        </span>
      </div>

      {/* Animated Background */}
      <div className="background-animation"></div>

      {/* Feature Cards */}
      <div className="features-container">
        {/* Reminder Card */}
        <div className="feature-card">
          <h3>➕ Add Reminders</h3>
          <p>Stay organized by setting personal or academic reminders for your tasks and deadlines.</p>
          <button onClick={() => navigate("/tasks")}>Add Reminder</button>
        </div>

        {/* Events Card */}
        <div className="feature-card">
          <h3>🗓️ Add Events</h3>
          <p>Schedule and track upcoming events like exams, meetings, and personal goals.</p>
          <button onClick={() => navigate("/calendar")}>Add Event</button>
        </div>

        {/* Pins Card */}
        <div className="feature-card">
          <h3>📌 Add Pins</h3>
          <p>Pin important notes or tasks to your dashboard so you never miss them!</p>
          <button onClick={() => navigate("/notes")}>Add Pin</button>
        </div>
              {/* Project Overview and Robot */}
      <div className="project-overview">
        {/* Content on the Left */}
        <div className="overview-text">
          <p>
            EDU-TIMELY is your ultimate educational companion. With powerful features like reminders, event tracking, and note pinning, stay on top of your tasks and deadlines!
          </p>
        </div>

        {/* Robot on the Right */}
        <div className="robot-container" onClick={handleRobotClick}>
          <Lottie options={lottieOptions} height={200} width={200} />
        </div>
      </div>

      {/* Creator Details Modal */}
      {showCreatorDetails && (
        <div className="creator-details">
          <h3>Project Creators</h3>
          <p>
            <strong>Creator 1:</strong> Ruhi - 221FA04402
          </p>
          <p>
            <strong>Creator 2:</strong> Likhitha - 221FA04436
          </p>
          <p>
            <strong>Creator 3:</strong> Ankith - 221FA04737
          </p>
          <p>
            <strong>Project Lead:</strong> Pallavi - 221FA04538
          </p>
        </div>
      )}

      </div>
    </div>
  );
}
