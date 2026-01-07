const express = require("express");
const router = express.Router();

const Cohort = require("../models/Cohort.model");

// GET all cohorts
router.get("/", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (err) {
    next(err);
  }
});

// GET cohort by id
router.get("/:cohortId", async (req, res, next) => {
  try {
    const cohort = await Cohort.findById(req.params.cohortId);
    if (!cohort) return res.status(404).json({ message: "Cohort not found" });
    res.json(cohort);
  } catch (err) {
    next(err);
  }
});

// CREATE cohort
router.post("/", async (req, res, next) => {
  try {
    const newCohort = await Cohort.create(req.body);
    res.status(201).json(newCohort);
  } catch (err) {
    next(err);
  }
});

// UPDATE cohort by id
router.put("/:cohortId", async (req, res, next) => {
  try {
    const updated = await Cohort.findByIdAndUpdate(req.params.cohortId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Cohort not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE cohort by id
router.delete("/:cohortId", async (req, res, next) => {
  try {
    const deleted = await Cohort.findByIdAndDelete(req.params.cohortId);

    if (!deleted) return res.status(404).json({ message: "Cohort not found" });
    res.json({ message: "Cohort deleted", deletedCohort: deleted });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
