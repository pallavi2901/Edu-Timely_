const mongoose = require('mongoose');

const deadlineSchema = new mongoose.Schema({
  day: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Deadline', deadlineSchema);
