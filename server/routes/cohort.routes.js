const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Cohort = require("../models/Cohort.model");
const isAuthenticated = require("../middleware/jwt.middleware");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (err) {
    next(err);
  }
});


router.get("/:cohortId", isAuthenticated, async (req, res, next) => {
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


router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newCohort = await Cohort.create(req.body);
    res.status(201).json(newCohort);
  } catch (err) {
    next(err);
  }
});


router.put("/:cohortId", isAuthenticated, async (req, res, next) => {
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


router.delete("/:cohortId", isAuthenticated, async (req, res, next) => {
  try {
    const { cohortId } = req.params;

    if (!isValidObjectId(cohortId)) {
      return next({ status: 400, message: "Invalid cohortId" });
    }

    const deleted = await Cohort.findByIdAndDelete(cohortId);

    if (!deleted) {
      return next({ status: 404, message: "Cohort not found" });
    }


    res.json({ message: "Cohort deleted", deletedCohort: deleted });
  } catch (err) {
    next(err);
  }
});

module.exports = router;