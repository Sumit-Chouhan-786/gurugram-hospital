const { v4: uuidv4 } = require("uuid");
const Appointment = require("../../models/appoinmentModel");

// ======================================================================== Create Appointment
const createAppointment = async (req, res) => {
  try {
    console.log("Received form data:", req.body); // Log the incoming data

    // Extract fields from the request body
    const { name, email, phone, services, teams, dateAndTime } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !services || !teams || !dateAndTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Generate a unique UUID for each appointment
    const appointmentUuid = uuidv4();

    // Create a new appointment with UUID
    const newAppointment = new Appointment({
      uuid: appointmentUuid, // Assign UUID here
      name,
      email,
      phone,
      services,
      teams,
      dateAndTime,
    });

    // Save the new appointment
    await newAppointment.save();

    console.log("Appointment created successfully!");
    return res.redirect("/"); // Redirect to homepage or another relevant page
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({
      message: "An error occurred while creating the appointment.",
      error: error.message,
    });
  }
};
// ======================================================================== Show All Appointments for Index
const getAllAppointmentForIndex = async () => {
  try {
    const appointments = await Appointment.find()
      .populate("services", "name") // Populate service name
      .populate("teams", "name"); // Populate team (doctor) name
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments.");
  }
};

// ======================================================================== Delete Appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    console.log("Appointment deleted successfully:", id);

    // Get updated list of appointments
    const appointments = await Appointment.find()
      .populate("services", "name")
      .populate("teams", "name");

    // Store data in session (if applicable)
    req.session.appointments = appointments;
    req.session.message = {
      type: "success",
      content: "Appointment deleted successfully.",
    };

    // Redirect to the appointments list
    return res.redirect("/admin/enquire");
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the appointment.",
    });
  }
};

// ======================================================================== Export Functions
module.exports = {
  createAppointment,
  getAllAppointmentForIndex,
  deleteAppointment,
};
