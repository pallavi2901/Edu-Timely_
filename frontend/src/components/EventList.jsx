import React from "react";
import "./Calendar.css";

const EventList = ({ events, onDelete, onRemind }) => {
  return (
    <div className="event-list">
      <h3>Event List</h3>
      {events.length === 0 ? (
        <p>No events added yet.</p>
      ) : (
        events.map((event) => (
          <div key={event._id} className="event-item">
            <span>
              {event.title} - {new Date(event.date).toDateString()}
            </span>
            <div>
              <button onClick={() => onDelete(event._id)}>Delete</button>
              <button onClick={() => onRemind(event)}>Remind</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;
