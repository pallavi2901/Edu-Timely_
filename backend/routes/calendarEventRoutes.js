const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');


router.post('/', async (req, res) => {
  try {
    const { title, date, reminderTime } = req.body;
    const newEvent = new CalendarEvent({ title, date, reminderTime });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err });
  }
});


router.get('/', async (req, res) => {
  try {
    const events = await CalendarEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await CalendarEvent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err });
  }
});

module.exports = router;
