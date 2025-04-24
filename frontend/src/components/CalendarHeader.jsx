import React from 'react';
import './Calendar.css';

const CalendarHeader = ({ currentMonth, currentYear, onMonthChange, onYearChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const today = new Date().getDay(); // Get current day index (0 for Sun, 1 for Mon, etc.)

  return (
    <div className="calendar-header-container">

      {/* Year Navigation */}
      <div className="calendar-year-nav">
        <button onClick={() => onYearChange(currentYear - 1)}>Prev Year</button>
        <h2>&lt;Calendar {currentYear} &gt;</h2>
        <button onClick={() => onYearChange(currentYear + 1)}>Next Year</button>
      </div>

      {/* Month and Year Dropdowns */}
      <div className="calendar-controls">
        <select value={currentMonth} onChange={(e) => onMonthChange(Number(e.target.value))}>
          {months.map((month, idx) => (
            <option key={idx} value={idx}>{month}</option>
          ))}
        </select>

        <select value={currentYear} onChange={(e) => onYearChange(Number(e.target.value))}>
          {[...Array(11)].map((_, idx) => {
            const year = 2020 + idx;
            return (
              <option key={year} value={year}>{year}</option>
            );
          })}
        </select>
      </div>

      {/* Days of the week with dynamic highlight for current day */}
      <div className="calendar-header-days">
        {dayNames.map((day, idx) => (
          <div key={idx} className={`day-name ${idx === today ? 'current-day' : ''}`}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
