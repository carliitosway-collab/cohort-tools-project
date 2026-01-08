const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Student = require("../models/Student.model");

// Helper: validar ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

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
    const { cohortId } = req.params;

    if (!isValidObjectId(cohortId)) {
      return next({ status: 400, message: "Invalid cohortId" });
    }

    const students = await Student.find({ cohort: cohortId }).populate("cohort");
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
    const { studentId } = req.params;

    if (!isValidObjectId(studentId)) {
      return next({ status: 400, message: "Invalid studentId" });
    }

    const student = await Student.findById(studentId).populate("cohort");

    if (!student) {
      return next({ status: 404, message: "Student not found" });
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

    // Si quieres devolverlo populateado (bonito para Postman):
    const createdStudent = await Student.findById(newStudent._id).populate("cohort");

    res.status(201).json(createdStudent);
  } catch (err) {
    next(err);
  }
});

// ==========================
// UPDATE student by id
// ==========================
router.put("/:studentId", async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (!isValidObjectId(studentId)) {
      return next({ status: 400, message: "Invalid studentId" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, {
      new: true,
      runValidators: true,
    }).populate("cohort");

    if (!updatedStudent) {
      return next({ status: 404, message: "Student not found" });
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
    const { studentId } = req.params;

    if (!isValidObjectId(studentId)) {
      return next({ status: 400, message: "Invalid studentId" });
    }

    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return next({ status: 404, message: "Student not found" });
    }

    res.json({ message: "Student deleted", deletedStudent });

    // Alternativa REST pura: res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
