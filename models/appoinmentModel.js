const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  services: { type: String, required: true },
  teams: { type: String, required: true },
  dateAndTime: { type: String, required: true },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
