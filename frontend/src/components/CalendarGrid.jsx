import React from "react";

const CalendarGrid = ({ days, onDayClick, events }) => {
  return (
    <div className="calendar-grid">
      {days.map((day, index) => (
        <div
          key={index}
          className={`calendar-cell ${day ? "active-day" : "empty-day"}`}
          onClick={() => day && onDayClick(day)} // ✅ Click only on valid dates
          style={{
            cursor: day ? "pointer" : "default", // ✅ Fix cursor
            // backgroundColor: day ? "#f5f5f5" : "transparent",
          }}
        >
          {day && day.getDate()}

          {/* ✅ Show Event Indicator */}
          {day &&
            events.some((e) => new Date(e.date).toDateString() === day.toDateString()) && (
              <span className="event-indicator">●</span>
            )}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
