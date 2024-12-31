const Appointment = require("../models/appointmentModel");

// ======================================================================== create appointment
const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, services, doctor, age } = req.body;

    // Validation: Check if all fields are provided
    if (!name || !email || !phone || !services || !doctor || !age) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate if the age is a number and greater than 0
    if (isNaN(age) || age <= 0) {
      return res.status(400).json({ message: "Please provide a valid age." });
    }

    // Check if the email already exists in the database
    const existingAppointment = await Appointment.findOne({ email });
    if (existingAppointment) {
      return res.status(400).json({
        message: "This email is already registered for an appointment.",
      });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      services,
      doctor,
      age,
    });

    // Save the new appointment to the database
    await newAppointment.save();

    // Redirect after successful creation
    res.redirect("/appointment");
  } catch (error) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the appointment." });
  }
};

// ======================================================================== show all appointments in admin dashboard
const getAllAppointmentForIndex = async () => {
  try {
    return await Appointment.find().sort({ createdAt: -1 }); // Sort by creation date descending
  } catch (err) {
    throw new Error("Error fetching appointments");
  }
};

// ======================================================================== delete an appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the appointment by its ID
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Fetch all remaining appointments after deletion
    const appointments = await Appointment.find();

    // Store data in session
    req.session.appointments = appointments;
    req.session.message = {
      type: "success",
      message: "Appointment deleted successfully.",
    };

    // Redirect after successful deletion
    res.redirect("/admin/allAppointment");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the appointment." });
  }
};

module.exports = {
  createAppointment,
  getAllAppointmentForIndex,
  deleteAppointment,
};
