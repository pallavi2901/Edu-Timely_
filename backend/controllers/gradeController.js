const Grade = require('../models/Grade');

const calculateCGPA = async () => {
  const grades = await Grade.find();
  if (grades.length === 0) return 0;

  const totalSGPA = grades.reduce((sum, g) => sum + g.sgpa, 0);
  return (totalSGPA / grades.length).toFixed(2);
};


const addGrade = async (req, res) => {
  try {
    const { semester, sgpa } = req.body;
    if (!semester || sgpa === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newGrade = new Grade({ semester, sgpa });
    await newGrade.save();

    const cgpa = await calculateCGPA();

    res.status(201).json({ message: "Grade added", cgpa });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getGrades = async (req, res) => {
    try {
        const userId = req.body.userId; 
        const grades = await Grade.find({ userId }).sort({ semester: 1 });
        const cgpa = await calculateCGPA(userId);

        res.json({ grades, cgpa });
    } catch (error) {
        res.status(500).json({ message: "Error fetching grades", error: error.message });
    }
};

module.exports = { addGrade, getGrades };
