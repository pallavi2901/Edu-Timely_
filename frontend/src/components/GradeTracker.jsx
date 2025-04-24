
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Grade.css";

export default function GradeTracker() {
  const [grades, setGrades] = useState([]);
  const [semester, setSemester] = useState(1);
  const [sgpa, setSgpa] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5001/api/grades")
      .then((response) => {
        setGrades(response.data.grades || []);
        const lastSemester = response.data.grades?.[response.data.grades.length - 1]?.semester || 0;
        setSemester(lastSemester + 1);
      })
      .catch((error) => {
        console.error("Error fetching grades:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGrade = { semester, sgpa: parseFloat(sgpa) };

    try {
      await axios.post("http://localhost:5001/api/grades", newGrade, {
        headers: { 'Content-Type': 'application/json' }
      });

      setGrades([...grades, newGrade]);
      setSemester(semester + 1);
      setSgpa("");
    } catch (error) {
      console.error("Error adding grade:", error.response ? error.response.data : error);
    }
  };

  const overallSGPA = (
    grades.reduce((acc, curr) => acc + curr.sgpa, 0) / grades.length || 0
  ).toFixed(2);

  const data = {
    labels: grades.map((g) => `Sem ${g.semester}`),
    datasets: [
      {
        label: "SGPA Growth",
        data: grades.map((g) => g.sgpa),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        fill: true,
      },
      {
        label: "Target SGPA (9.0)",
        data: grades.map(() => 9.0),
        borderColor: "red",
        borderDash: [10, 5],
      },
    ],
  };

  return (
    <div className="grade-tracker-wrapper">
      <center><h2>Grade Tracker</h2></center>

      <div className="grade-container">
        <form onSubmit={handleSubmit}>
          <label>Semester:</label>
          <input type="number" value={semester} disabled />

          <label>SGPA:</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={sgpa}
            onChange={(e) => setSgpa(e.target.value)}
            required
          />

          <button type="submit">Add Grade</button>
        </form>
      </div>

      <div className="grade-list">
        <h3>Overall SGPA: {overallSGPA}</h3>
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>SGPA</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, index) => (
              <tr key={index}>
                <td>{g.semester}</td>
                <td>{g.sgpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="chart-container">
        <Line data={data} />
      </div>
    </div>
  );
}
