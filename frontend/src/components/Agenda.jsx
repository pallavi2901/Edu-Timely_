import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';
import './Agenda.css';

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [agendaItems, setAgendaItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/tasks');
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    if (Array.isArray(tasks)) {
      const tasksForSelectedDate = tasks.filter((task) => {
        const taskDate = new Date(task.date);
        const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
        return taskDateOnly.getTime() === selectedDateOnly.getTime();
      });
      setAgendaItems(tasksForSelectedDate);
    }
  }, [selectedDate, tasks]);

  const handleDateChange = (date) => setSelectedDate(date);

  const completedTasks = agendaItems.filter((item) => item.completed);
  const nonCompletedTasks = agendaItems.filter((item) => !item.completed);

  const graphData = {
    labels: ['Completed', 'Not Completed'],
    datasets: [
      {
        label: 'Task Completion',
        data: [completedTasks.length, nonCompletedTasks.length],
        backgroundColor: ['#4caf50', '#ff9800'],
      },
    ],
  };

  return (
    <div className="agenda-container">
      <div className="calendar-container">
        <h2>Study Calendar</h2>
        <Calendar onChange={handleDateChange} value={selectedDate} className="custom-calendar" />
      </div>

      <div className="agenda-details">
        <h2>Agenda for {selectedDate.toDateString()}</h2>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading tasks...</p>}

        <div className="agenda-columns">
          <div className="completed-tasks-container">
            <h3>Completed Tasks</h3>
            <ul>
              {completedTasks.map((task) => (
                <li key={task._id}>{task.title}</li>
              ))}
            </ul>
          </div>

          <div className="not-completed-tasks-container">
            <h3>Not Completed Tasks</h3>
            <ul>
              {nonCompletedTasks.map((task) => (
                <li key={task._id}>{task.title}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="chart-container">
   <h3>Task Completion Statistics</h3>
   <Bar data={graphData} options={{ maintainAspectRatio: false }} />
</div>

      </div>
    </div>
  );
}