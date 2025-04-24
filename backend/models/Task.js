const mongoose = require('mongoose'); // ✅ Required import

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  completed: {
    type: Boolean,
    default: false, // 👈 Default value for safety
  },
});

module.exports = mongoose.model('Task', taskSchema);


