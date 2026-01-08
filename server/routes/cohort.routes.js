const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Cohort = require("../models/Cohort.model");

// Helper: validar ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ==========================
// GET all cohorts
// ==========================
router.get("/", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (err) {
    next(err);
  }
});

// ==========================
// GET cohort by id
// ==========================
router.get("/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;

    if (!isValidObjectId(cohortId)) {
      return next({ status: 400, message: "Invalid cohortId" });
    }

    const cohort = await Cohort.findById(cohortId);

    if (!cohort) {
      return next({ status: 404, message: "Cohort not found" });
    }

    res.json(cohort);
  } catch (err) {
    next(err);
  }
});

// ==========================
// CREATE cohort
// ==========================
router.post("/", async (req, res, next) => {
  try {
    const newCohort = await Cohort.create(req.body);
    res.status(201).json(newCohort);
  } catch (err) {
    next(err);
  }
});

// ==========================
// UPDATE cohort by id
// ==========================
router.put("/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;

    if (!isValidObjectId(cohortId)) {
      return next({ status: 400, message: "Invalid cohortId" });
    }

    const updated = await Cohort.findByIdAndUpdate(cohortId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return next({ status: 404, message: "Cohort not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ==========================
// DELETE cohort by id
// ==========================
router.delete("/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;

    if (!isValidObjectId(cohortId)) {
      return next({ status: 400, message: "Invalid cohortId" });
    }

    const deleted = await Cohort.findByIdAndDelete(cohortId);

    if (!deleted) {
      return next({ status: 404, message: "Cohort not found" });
    }

    // Puedes devolver 200 con mensaje (ok para Ironhack)
    res.json({ message: "Cohort deleted", deletedCohort: deleted });

    // Alternativa más REST: res.status(204).send(); (sin body)
  } catch (err) {
    next(err);
  }
});

module.exports = router;
