import React, { useState, useEffect, useRef } from "react";
import "./Calendar.css";

const EventPopup = ({ date, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [reminderTime, setReminderTime] = useState("0");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Event title cannot be empty!");
      return;
    }
    onSave({
      title: title.trim(),
      date,
      reminderTime: parseInt(reminderTime),
    });
    setTitle("");
    setReminderTime("0");
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div className="event-popup">
      <h3>Add Event for {date.toDateString()}</h3>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter event title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <select
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
      >
        <option value="0">At event time</option>
        <option value="5">5 minutes before</option>
        <option value="15">15 minutes before</option>
        <option value="60">1 hour before</option>
        <option value="1440">1 day before</option>
      </select>

      <div className="popup-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EventPopup;
