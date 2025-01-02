const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  uuid: { type: String, unique: true, required: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  services: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  teams: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  dateAndTime: { type: Date, required: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
