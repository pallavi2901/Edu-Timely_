const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade'); 

router.post('/', async (req, res) => {
    try {
      const { semester, sgpa } = req.body;
  
      
      if (!semester || sgpa === undefined) {
        return res.status(400).json({ message: "Semester and SGPA are required" });
      }
  
      
      if (isNaN(sgpa)) {
        return res.status(400).json({ message: "SGPA must be a valid number" });
      }
  
    
      const newGrade = new Grade({ semester, sgpa });
      await newGrade.save();
  
     
      const grades = await Grade.find(); 
      const totalSGPA = grades.reduce((acc, grade) => acc + grade.sgpa, 0);
      const overallSGPA = totalSGPA / grades.length;
  
      
      res.status(201).json({
        message: "Grade added successfully",
        newGrade,
        overallSGPA,
      });
    } catch (error) {
      console.error("Error in POST route:", error); 
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  


router.get('/', async (req, res) => {
    try {
      const grades = await Grade.find();
      if (grades.length === 0) {
        return res.status(200).json({ message: "No grades available" });
      }
  
      const totalSGPA = grades.reduce((acc, grade) => acc + grade.sgpa, 0);
      const overallSGPA = totalSGPA / grades.length;
  
      res.status(200).json({
        grades,
        overallSGPA,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching grades", error: error.message });
    }
  });
  

module.exports = router;
