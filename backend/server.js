const express = require('express');

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const Grade = require('./models/Grade'); 
const Task = require('./models/Task'); 
const gradeRoutes = require('./routes/gradesRoutes');
const taskRoutes = require('./routes/taskRoutes');
const googleCalendarRoutes = require('./routes/googleCalendarRoutes');
const deadlineRoutes = require('./routes/deadlineRoutes');
const notesRoutes = require('./routes/notesRoutes');
const authRoutes = require('./routes/authRoutes');
const calendarEventRoutes = require('./routes/calendarEventRoutes');

const app = express();
const cors = require('cors');

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//   origin: 'http://localhost:5174',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/edu-timely', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected to edu-timely DB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/grades', gradeRoutes);  
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/calendar', googleCalendarRoutes);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/events', calendarEventRoutes);
app.get('/api/test', async (req, res) => {
  try {
    const grades = await Grade.find();  
    res.status(200).json({ message: 'MongoDB connection is working', grades });
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to MongoDB', error: error.message });
  }
});
app.post('/api/test', (req, res) => {
  console.log('Test Route Received:', req.body);
  res.status(200).json({ message: 'Test POST successful' });
});
app.put('/api/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const { title, description, date, completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, {
      title,
      description,
      date,
      completed,
    }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
});


app.post('/api/tasks', async (req, res) => {
  try {
    console.log("Received Task:", req.body);
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: "Error saving task", error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});