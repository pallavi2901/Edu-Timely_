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

  // Function to sort tasks (Today and Yesterday on top)
  function sortTasks(taskList) {
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
  }

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(Array.isArray(data) ? sortTasks(data) : []);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setErrorMessage("Failed to fetch tasks. Please try again later.");
      });
  }, []);

  const handleCreate = () => {
    if (!newTask.title || !newTask.description || !newTask.date) return;

    const taskWithDate = { ...newTask, completed: false };

    createTask(taskWithDate)
      .then((createdTask) => {
        setTasks((prev) => sortTasks([...prev, createdTask]));
        setNewTask({ title: "", description: "", date: "" });
      })
      .catch(() => {
        setErrorMessage("Failed to create task. Please try again.");
      });
  };

  const handleUpdate = () => {
    if (!editTaskData.title || !editTaskData.description || !editTaskData.date) return;
  
    console.log("Updating task with data:", editTaskData); // Log the data before updating
  
    updateTask(editTaskId, editTaskData)
      .then((updatedTask) => {
        console.log("Updated task from API:", updatedTask);  // Log the updated task
        setTasks((prev) =>
          sortTasks(prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)))
        );
        setEditMode(false);
        setEditTaskId(null);
        setEditTaskData({ title: "", description: "", date: "" });
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        setErrorMessage("Failed to update task. Please try again.");
      });
  };
  


  const handleDelete = (id) => {
    deleteTask(id)
      .then(() => {
        setTasks((prev) => sortTasks(prev.filter((task) => task._id !== id)));
      })
      .catch(() => {
        setErrorMessage("Failed to delete task. Please try again.");
      });
  };

  const startEdit = (task) => {
    setEditMode(true);
    setEditTaskId(task._id);
    setEditTaskData({ title: task.title, description: task.description, date: task.date });
  };

 

  const handleCheckboxChange = async (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;
  
      const updatedTask = { ...task, completed: !task.completed };
  
      await updateTask(taskId, updatedTask);
  
      setTasks((prev) =>
        sortTasks(prev.map((t) => (t._id === taskId ? updatedTask : t)))
      );
  
      setAgendaItems((prevItems) =>
        prevItems.map((item) =>
          item._id === taskId ? { ...item, completed: updatedTask.completed } : item
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      setErrorMessage("Failed to update task. Please try again.");
    }
  };
  

  return (
   
    <div className="task-container">
    {/* Task Form */}
    <div className="task-form">
      
        <h3>{editMode ? "Editing Task" : "Add New Task"}</h3>
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
    

    {/* Task List */}
    <div className="task-list">
        {tasks.map((task) => (
            <div key={task._id} className="task-card">
                <div>
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleCheckboxChange(task._id, !task.completed)}
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

