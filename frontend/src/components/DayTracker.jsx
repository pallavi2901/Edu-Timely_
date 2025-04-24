// src/components/DayTracker.jsx
import React, { useState } from 'react';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DayTracker() {
  const [deadlines, setDeadlines] = useState({});

  const addDeadline = (day) => {
    const title = prompt(`Add a deadline for ${day}`);
    if (title) {
      setDeadlines((prev) => ({
        ...prev,
        [day]: [...(prev[day] || []), { title }]
      }));
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {daysOfWeek.map((day) => (
        <div key={day} className="border rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-bold mb-2">{day}</h2>
          <ul className="space-y-1">
            {(deadlines[day] || []).map((item, idx) => (
              <li key={idx} className="flex justify-between items-center">
                {item.title}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => addDeadline(day)} 
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Deadline
          </button>
        </div>
      ))}
    </div>
  );
}
