import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import EventPopup from "./EventPopup";
import EventList from "./EventList";
import CalendarGrid from "./CalendarGrid";
// import "./GoogleCalendar.css";
// import "./CalendarHeader.css";
// import "./CalendarGrid.css";
import "./Calendar.css";

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const daysArray = [];
  for (let i = 0; i < startDay; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(new Date(currentYear, currentMonth, i));
  }

  const handleDateClick = (day) => {
    if (!day) return;
    console.log("Clicked Date:", day); // ✅ Debugging: Check if date click is working
    setSelectedDate(day);
  };
  
  const handleReminder = (event) => {
    const eventDate = new Date(event.date);
    const reminderOffset = event.reminderTime * 60000;
    const remindAt = eventDate.getTime() - reminderOffset;
    const now = Date.now();
    const delay = remindAt - now;
  
    if (delay <= 0) {
      alert("Reminder time has already passed.");
      return;
    }
  
    if (Notification.permission === "granted" || Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setTimeout(() => {
            new Notification(`⏰ Reminder: ${event.title} on ${eventDate.toDateString()}`);
          }, delay);
          alert("Reminder scheduled successfully!");
        }
      });
    } else {
      alert("Notifications are blocked by the browser.");
    }
  };
  
  const addEvent = async (eventData) => {
    if (!selectedDate) return;

    const newEvent = {
      title: eventData.title,
      description: eventData.description,
      date: selectedDate,
      reminderTime: eventData.reminderTime,
    };

    try {
      const response = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const savedEvent = await response.json();
        setEvents((prev) => [...prev, savedEvent]);
        setSelectedDate(null);
      } else {
        console.error("Failed to save event");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        // ✅ Properly update the event list after deleting
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
      } else {
        console.error("Failed to delete event from server");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };
  

  return (
    <div className="calendar-page-container">
      <div className="calendar-left">
        <CalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          onMonthChange={setCurrentMonth}
          onYearChange={setCurrentYear}
        />
        <CalendarGrid days={daysArray} onDayClick={handleDateClick} events={events} />
        {selectedDate && (
          <EventPopup
            date={selectedDate}
            onClose={() => setSelectedDate(null)}
            onSave={addEvent}
          />
        )}
      </div>
      <div className="calendar-right">
        <EventList events={events} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Calendar;
