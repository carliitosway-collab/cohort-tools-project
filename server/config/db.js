const mongoose = require("mongoose");

function connectDB(MONGODB_URI) {
  return mongoose.connect(MONGODB_URI);
}

module.exports = connectDB;
