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

    // Check if an appointment already exists with the same email
    const existingAppointment = await Appointment.findOne({ email });
    if (existingAppointment) {
      return res.status(400).json({
        message: "This email is already registered for an appointment.",
      });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      services,
      teams, // Correct field name
      dateAndTime, // Adding the dateAndTime field
    });

    // Save the new appointment
    await newAppointment.save();

    console.log("Appointment created successfully!");
    return res.redirect("/contact");
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({
      message: "An error occurred while creating the appointment.",
    });
  }
};


// ======================================================================== Show All Appointments in Admin Dashboard
const getAllAppointmentForIndex = async () => {
  return await Appointment.find()
    .populate("services", "name") 
    .populate("teams", "name"); 
};

// ======================================================================== Delete Appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Get updated list of appointments
    const appointments = await Appointment.find();

    // Store data in session
    req.session.appointments = appointments;
    req.session.message = {
      type: "success",
      message: "Appointment deleted successfully.",
    };

    // Redirect to the appointments list
    res.redirect("/admin/enquire");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while deleting the appointment.",
    });
  }
};

module.exports = {
  createAppointment,
  getAllAppointmentForIndex,
  deleteAppointment,
};
