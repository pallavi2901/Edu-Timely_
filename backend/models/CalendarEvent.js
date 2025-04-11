const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  reminderTime: { type: Number, required: true }
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
