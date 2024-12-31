const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    services: { type: String, required: true },
    doctor: { type: String, required: true },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Appointment", appointmentSchema);
