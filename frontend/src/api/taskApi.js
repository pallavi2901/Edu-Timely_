import axios from 'axios';

// const API_URL = 'http://localhost:5001/api/tasks';

// export const getTasks = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };

export const createTask = async (task) => {
  const response = await axios.post(API_URL, task);
  return response.data;
};

// taskApi.js

const apiUrl = 'http://localhost:5001/api/tasks'; // Ensure this URL is correct for your backend

export const getTasks = async () => {
  const response = await fetch(apiUrl); // or use axios
  return await response.json();
};

export const updateTask = async (taskId, updatedTask) => {
  const response = await fetch(`${apiUrl}/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTask),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return await response.json();
};



export const deleteTask = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
