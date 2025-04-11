const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.json(tasks); 
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
