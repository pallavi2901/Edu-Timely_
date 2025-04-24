import axios from 'axios';
import { useEffect, useState } from 'react';

const CalendarComponent = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ date: '', title: '', description: '' });

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/calendar-events/${userId}`);
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.date || !newEvent.title || !newEvent.description) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/calendar-events`, { ...newEvent, userId });
      fetchEvents();
      setNewEvent({ date: '', title: '', description: '' });
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/calendar-events/${id}`);
      setEvents(events.filter(event => event._id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  return (
    <div>
      <h2>📅 Study Calendar</h2>
      <input
        type="date"
        value={newEvent.date}
        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
      />
      <input
        type="text"
        placeholder="Title"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newEvent.description}
        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
      />
      <button onClick={handleAddEvent} disabled={!newEvent.date || !newEvent.title || !newEvent.description}>
        Add Event
      </button>

      <ul>
        {events.map((event) => (
          <li key={event._id} style={{ marginBottom: '8px' }}>
            <strong>{event.date}</strong>: {event.title} - {event.description}
            <button style={{ marginLeft: '10px' }} onClick={() => handleDeleteEvent(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarComponent;
