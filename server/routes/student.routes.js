const express = require("express");
const router = express.Router();

const Student = require("../models/Student.model");

// ==========================
// GET all students (+ populate cohort)
// ==========================
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find().populate("cohort");
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// ==========================
// GET students by cohort id
// ==========================
router.get("/cohort/:cohortId", async (req, res, next) => {
  try {
    const students = await Student.find({
      cohort: req.params.cohortId,
    }).populate("cohort");

    res.json(students);
  } catch (err) {
    next(err);
  }
});

// ==========================
// GET student by id
// ==========================
router.get("/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId).populate("cohort");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    next(err);
  }
});

// ==========================
// CREATE student
// ==========================
router.post("/", async (req, res, next) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    next(err);
  }
});

// ==========================
// UPDATE student by id
// ==========================
router.put("/:studentId", async (req, res, next) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true, runValidators: true }
    ).populate("cohort");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    next(err);
  }
});

// ==========================
// DELETE student by id
// ==========================
router.delete("/:studentId", async (req, res, next) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.studentId);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted", deletedStudent });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
