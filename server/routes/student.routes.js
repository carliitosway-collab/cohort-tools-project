const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Student = require("../models/Student.model");
const isAuthenticated = require("../middleware/jwt.middleware");


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const students = await Student.find().populate("cohort");
    res.json(students);
  } catch (err) {
    next(err);
  }
});


router.get("/cohort/:cohortId", isAuthenticated, async (req, res, next) => {
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


router.get("/:studentId", isAuthenticated, async (req, res, next) => {
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


router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newStudent = await Student.create(req.body);

    const createdStudent = await Student.findById(newStudent._id).populate("cohort");
    res.status(201).json(createdStudent);
  } catch (err) {
    next(err);
  }
});


router.put("/:studentId", isAuthenticated, async (req, res, next) => {
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


router.delete("/:studentId", isAuthenticated, async (req, res, next) => {
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
  } catch (err) {
    next(err);
  }
});

module.exports = router;
