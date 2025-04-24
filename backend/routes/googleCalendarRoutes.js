const express = require('express');
const router = express.Router();

router.get('/events', (req, res) => {
    res.json({ message: 'GET all events from Google Calendar' });
});

router.post('/add-event', (req, res) => {
    res.json({ message: 'Event added to Google Calendar' });
});

router.delete('/delete-event/:id', (req, res) => {
    res.json({ message: `Event with id ${req.params.id} deleted` });
});

module.exports = router; 
