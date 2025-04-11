import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaPlay, FaPause, FaRedo, FaMugHot, FaRegClock } from "react-icons/fa";
import "./PomodoroTimer.css";

export default function PomodoroTimer({ theme }) {
  const [page, setPage] = useState("home"); // 'home', 'work', 'break'
  const [selectedTime, setSelectedTime] = useState(25);
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const times = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

  // Timer Logic
  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      setIsRunning(false);
      setPage("home"); // Reset to home when timer ends
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  useEffect(() => {
    if (time === 0) {
      setIsRunning(false);
      setPage("home");
      setTime(selectedTime * 60); // Reset time after session ends
    }
  }, [time, selectedTime]);

  const formatTime = (t) => {
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePlay = useCallback(() => {
    if (!isRunning) {
      setTime(selectedTime * 60);
      setPage("work");
      setIsRunning(true);
    }
  }, [selectedTime, isRunning]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleRestart = useCallback(() => {
    setTime(selectedTime * 60);
    setIsRunning(false);
    setPage("home");
  }, [selectedTime]);

  const handleBreak = useCallback(() => {
    setTime(5 * 60);
    setPage("break");
    setIsRunning(true);
  }, []);

  const renderTimerScreen = (mode) => (
    <div className={`timer-screen ${mode}-mode ${theme}`}>
      <div className="timer-circle" ref={timerRef}>
        <div className="timer-text">{formatTime(time)}</div>
      </div>
      <div className="controls">
        {!isRunning ? (
          <button className="btn-3d" onClick={handlePlay}>
            <FaPlay />
          </button>
        ) : (
          <button className="btn-3d" onClick={handlePause}>
            <FaPause />
          </button>
        )}
        <button className="btn-3d" onClick={handleRestart}>
          <FaRedo />
        </button>
        <button className="btn-3d" onClick={handleBreak}>
          <FaMugHot />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`pomodoro-ui ${theme}`}>
      {page === "home" && (
        <div className="pomodoro-page">
          {/* Left Side */}
          <div className="left-panel">
            <h2 className="pomodoro-heading">
              <FaRegClock className="timer-icon" /> POMODORO TIMER
            </h2>
            <p className="pomodoro-description">
              Boost focus and manage your time better with the Pomodoro technique.
              Choose your preferred time and stay productive!
            </p>
          </div>

          {/* Right Side */}
          <div className="right-panel">
            <div className="circle-wrapper">
              <div className="main-timer">
                <span className="main-text">{selectedTime}</span>
                <div className="main-timer-glow">
                  <FaPlay onClick={handlePlay} className="central-play" />
                </div>
              </div>
              {times.map((num, idx) => {
                const angle = (idx / times.length) * 2 * Math.PI;
                const x = 170 + 150 * Math.cos(angle);
                const y = 170 + 150 * Math.sin(angle);
                return (
                  <div
                    key={num}
                    className={`circle-number ${selectedTime === num ? "selected" : ""}`}
                    style={{ left: `${x}px`, top: `${y}px` }}
                    onClick={() => setSelectedTime(num)}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {page === "work" && renderTimerScreen("work")}
      {page === "break" && renderTimerScreen("break")}
    </div>
  );
}
