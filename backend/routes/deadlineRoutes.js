const express = require('express');
const router = express.Router();
const Deadline = require('../models/Deadline');


router.post('/', async (req, res) => {
  try {
    const deadline = new Deadline(req.body);
    await deadline.save();
    res.status(201).json(deadline);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const deadlines = await Deadline.find();
    res.json(deadlines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Deadline.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deadline deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
