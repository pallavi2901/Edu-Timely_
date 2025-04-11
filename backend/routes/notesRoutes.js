const express = require("express");
const multer = require("multer");
const Note = require("../models/Note");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newNote = new Note({ title, content, fileUrl });
    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: "Error adding note" });
  }
});


router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notes" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting note" });
  }
});

module.exports = router;
