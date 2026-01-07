require("dotenv").config();
const mongoose = require("mongoose");

// ✅ Ajusta estos require según tus nombres reales:
const Cohort = require("./models/Cohort.model");   
const Student = require("./models/Student.model"); 

const cohortsData = require("./cohorts.json");
const studentsData = require("./students.json");

// Normalizadores para que el JSON pase los enums del Schema
const CAMPUS_MAP = {
  MADRID: "Madrid",
  BARCELONA: "Barcelona",
  MIAMI: "Miami",
  PARIS: "Paris",
  BERLIN: "Berlin",
  AMSTERDAM: "Amsterdam",
  LISBON: "Lisbon",
  REMOTE: "Remote",
};

const FORMAT_MAP = {
  "FULL TIME": "Full Time",
  FULL_TIME: "Full Time",
  "PART TIME": "Part Time",
  PART_TIME: "Part Time",
};

const PROGRAM_MAP = {
  "WEB DEV": "Web Dev",
  WEB_DEV: "Web Dev",
  "UX/UI": "UX/UI",
  "DATA ANALYTICS": "Data Analytics",
  DATA_ANALYTICS: "Data Analytics",
  CYBERSECURITY: "Cybersecurity",
};

function normalizeValue(value, map) {
  if (value === undefined || value === null) return value;
  const raw = String(value).trim();
  return map[raw] || map[raw.toUpperCase()] || raw;
}

function normalizeCohort(cohort) {
  return {
    ...cohort,
    campus: normalizeValue(cohort.campus, CAMPUS_MAP),
    format: normalizeValue(cohort.format, FORMAT_MAP),
    program: normalizeValue(cohort.program, PROGRAM_MAP),
  };
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB for seeding");

    // Limpia colecciones
    await Student.deleteMany();
    await Cohort.deleteMany();
    console.log("🧹 Cleared Students & Cohorts collections");

    // Insert cohorts y mapa oldId (num) -> ObjectId
    const cohortIdMap = new Map();

    for (const c of cohortsData) {
      const { _id: oldId, ...rest } = c;

      const created = await Cohort.create(normalizeCohort(rest));
      cohortIdMap.set(oldId, created._id);
    }

    console.log(`✅ Inserted ${cohortIdMap.size} cohorts`);

    // Insert students transformando cohort: number -> ObjectId
    const studentsToCreate = studentsData.map((s) => {
      const { _id, cohort, ...rest } = s;
      return {
        ...rest,
        cohort: cohortIdMap.get(cohort) || null,
      };
    });

    await Student.insertMany(studentsToCreate);
    console.log(`✅ Inserted ${studentsToCreate.length} students`);

    await mongoose.disconnect();
    console.log("✅ Seed complete. Disconnected.");
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
