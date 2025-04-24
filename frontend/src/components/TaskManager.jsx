import React, { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import "./TaskManager.css";

export default function TaskManager({ setAgendaItems }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", date: "" });
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({ title: "", description: "", date: "" });
  const [errorMessage, setErrorMessage] = useState(null);

  const sortTasks = (taskList) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date) => date.toISOString().split("T")[0];
    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    return [...taskList].sort((a, b) => {
      const aDate = formatDate(new Date(a.date));
      const bDate = formatDate(new Date(b.date));

      if (aDate === todayStr && bDate !== todayStr) return -1;
      if (bDate === todayStr && aDate !== todayStr) return 1;
      if (aDate === yesterdayStr && bDate !== yesterdayStr) return -1;
      if (bDate === yesterdayStr && aDate !== yesterdayStr) return 1;

      return new Date(a.date) - new Date(b.date);
    });
  };

  useEffect(() => {
    getTasks()
      .then((data) => {
        const sortedData = Array.isArray(data) ? sortTasks(data) : [];
        setTasks(sortedData);
        localStorage.setItem("tasks", JSON.stringify(sortedData));
      })
      .catch((error) => {
        setErrorMessage("Failed to fetch tasks. Please try again later.");
        console.error("Error fetching tasks:", error);
      });
  }, []);
  

  const handleCreate = () => {
    if (!newTask.title || !newTask.description || !newTask.date) return;

    const taskWithDate = { ...newTask, completed: false };
    createTask(taskWithDate)
      .then((createdTask) => {
        const updatedTasks = sortTasks([...tasks, createdTask]);
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks)); 
        setNewTask({ title: "", description: "", date: "" });
      })
      .catch(() => setErrorMessage("Failed to create task. Please try again."));
  };

  const handleUpdate = () => {
    if (!editTaskData.title || !editTaskData.description || !editTaskData.date) return;

    updateTask(editTaskId, editTaskData)
      .then((updatedTask) => {
        const updatedTasks = sortTasks(tasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        ));
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks)); 
        setEditMode(false);
        setEditTaskId(null);
        setEditTaskData({ title: "", description: "", date: "" });
      })
      .catch(() => setErrorMessage("Failed to update task. Please try again."));
  };

  const handleDelete = (id) => {
    deleteTask(id)
      .then(() => {
        const updatedTasks = sortTasks(tasks.filter((task) => task._id !== id));
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks)); 
      })
      .catch(() => setErrorMessage("Failed to delete task. Please try again."));
  };

  const startEdit = (task) => {
    setEditMode(true);
    setEditTaskId(task._id);
    setEditTaskData({
      title: task.title,
      description: task.description,
      date: task.date,
      completed: task.completed ?? false, 
    });
    
  };

  const handleCheckboxChange = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
  
    const toggledTask = { ...task, completed: !task.completed };
  
    try {
      const updatedTask = await updateTask(taskId, toggledTask);
  
      const updatedTasks = sortTasks(
        tasks.map((t) => (t._id === taskId ? updatedTask : t))
      );
  
      console.log("Saving updated tasks to localStorage", updatedTasks);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks)); 
      if (typeof setAgendaItems === "function") {
        setAgendaItems((prevItems) =>
          prevItems.map((item) =>
            item._id === taskId ? { ...item, completed: updatedTask.completed } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setErrorMessage("Failed to update task. Please try again.");
    }
  };
  

  return (
    <div className="task-container">
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="task-form">
        <h3>{editMode ? "Edit Task" : "Add New Task"}</h3>
        <div className="task-inputs">
          <input
            type="text"
            placeholder="Title"
            value={editMode ? editTaskData.title : newTask.title}
            onChange={(e) =>
              editMode
                ? setEditTaskData({ ...editTaskData, title: e.target.value })
                : setNewTask({ ...newTask, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={editMode ? editTaskData.description : newTask.description}
            onChange={(e) =>
              editMode
                ? setEditTaskData({ ...editTaskData, description: e.target.value })
                : setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <input
            type="date"
            value={editMode ? editTaskData.date : newTask.date}
            onChange={(e) =>
              editMode
                ? setEditTaskData({ ...editTaskData, date: e.target.value })
                : setNewTask({ ...newTask, date: e.target.value })
            }
          />
          {editMode ? (
            <>
              <button onClick={handleUpdate}>Update Task</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={handleCreate}>Create Task</button>
          )}
        </div>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">
            <div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleCheckboxChange(task._id)}
                style={{ cursor: "pointer" }}
              />
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <span>{new Date(task.date).toLocaleDateString()}</span>
            </div>
            <div>
              <button onClick={() => startEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
