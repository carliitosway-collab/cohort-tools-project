const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");

const cohortRoutes = require("./routes/cohort.routes");
const studentRoutes = require("./routes/student.routes");

const PORT = process.env.PORT || 5005;

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// DOCS
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// ROUTES
app.use("/api/cohorts", cohortRoutes);
app.use("/api/students", studentRoutes);

// ERROR HANDLER (simple, válido para Ironhack)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// CONNECT DB + START SERVER
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
