
const Task = require('../models/Task'); 

const createTask = async (req, res) => {
  try {
    const { title, description, date, completed } = req.body;

    const task = new Task({
      title,
      description,
      date,
      completed: completed ?? false, 
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

module.exports = { createTask };
