const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const mongoose = require("mongoose");

// ✅ Models
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

const PORT = process.env.PORT || 5005;

const app = express();

// MIDDLEWARE
// (CORS lo metemos luego si hace falta para el client)
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// ✅ GET all cohorts (from Mongo)
app.get("/api/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (err) {
    next(err);
  }
});

// ✅ GET cohort by id
app.get("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const cohort = await Cohort.findById(req.params.cohortId);
    if (!cohort) return res.status(404).json({ message: "Cohort not found" });
    res.json(cohort);
  } catch (err) {
    next(err);
  }
});

// ✅ GET all students (from Mongo) + populate cohort
app.get("/api/students", async (req, res, next) => {
  try {
    const students = await Student.find().populate("cohort");
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// ✅ GET students by cohort id
app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  try {
    const students = await Student.find({ cohort: req.params.cohortId }).populate(
      "cohort"
    );
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// ✅ GET student by id
app.get("/api/students/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId).populate("cohort");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// ✅ Basic error handler (para ver errores claros)
app.use((err, req, res, next) => {
  console.error("❌ API Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// CONNECT DB + START SERVER
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Error connecting to MongoDB:", err));
