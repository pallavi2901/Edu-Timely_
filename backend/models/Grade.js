const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  sgpa: { type: Number, required: true },
});

module.exports = mongoose.model('Grade', gradeSchema);
