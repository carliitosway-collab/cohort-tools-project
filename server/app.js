const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");

// ======================
// APP
// ======================
const app = express();

// ======================
// ROUTES IMPORT
// ======================
const cohortRoutes = require("./routes/cohort.routes");
const studentRoutes = require("./routes/student.routes");
const authRoutes = require("./routes/auth.routes");

// ======================
// PORT
// ======================
const PORT = process.env.PORT || 5005;

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ======================
// DOCS
// ======================
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// ======================
// ROUTES
// ======================
app.use("/auth", authRoutes);
app.use("/api/cohorts", cohortRoutes);
app.use("/api/students", studentRoutes);

// ======================
// 404 - Route not found
// ======================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === "ValidationError") {
    status = 400;
    message = err.message;
  }

  res.status(status).json({ message });
});

// ======================
// CONNECT DB + START SERVER
// ======================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
