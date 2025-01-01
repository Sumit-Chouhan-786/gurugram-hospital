const Testimonial = require("../../models/testimonialModel");
const path = require("path");
const fs = require("fs");

//========================================================================== Add Testimonial Controller Function
const addTestimonial = async (req, res) => {
  try {
    // Check if an image was uploaded
    if (!req.file) {
      req.session.message = {
        type: "danger",
        message: "Image upload failed. Please try again.",
      };
      return res.redirect("/admin/add-Testimonial");
    }

    // Create a new testimonial entry
    const testimonial = new Testimonial({
      name: req.body.name,
      description: req.body.description,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
      testimonialImage: req.file.filename,
      status: req.body.status || "active", // Default to 'active' if no status provided
    });

    // Save the testimonial to the database
    await testimonial.save();

    // Set a success message
    req.session.message = {
      type: "success",
      message: "Testimonial added successfully!",
    };

    res.redirect("/admin/all-testimonial");
  } catch (err) {
    console.error("Error adding testimonial:", err.message);
    req.session.message = {
      type: "danger",
      message:
        "An error occurred while adding the testimonial. Please try again.",
    };
    res.redirect("/admin/add-Testimonial");
  }
};

//========================================================================== Add Testimonial Page Controller Function
const addTestimonialPage = (req, res) => {
  const message = req.session.message || null;
  req.session.message = null; // Clear the session message after rendering
  res.render("admin-ui/addTestimonial.ejs", { message });
};

//========================================================================== All Testimonials Controller Function
const allTestimonials = async (req, res) => {
  try {
    // Fetch all testimonials from the database
    const testimonials = await Testimonial.find();

    res.render("admin-ui/allTestimonial.ejs", {
      testimonials, // Pass the testimonials to the view for rendering
      message: req.session.message || null, // Display success/error messages
    });

    req.session.message = null; // Clear the session message
  } catch (err) {
    console.error("Error fetching testimonial:", err.message);
    req.session.message = {
      type: "danger",
      message:
        "An error occurred while retrieving testimonials. Please try again.",
    };
    res.redirect("/admin");
  }
};

//======================== update testimonial page render
const updateTestimonialPage = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.render("admin-ui/updateTestimonial.ejs", {
      title: "Update Testimonial",
      testimonial: testimonial,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//========================================================================== Update Testimonial Controller Function
const updateTestimonial = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    if (req.file) {
      new_image = req.file.filename;

      // Delete the previous image if a new image is uploaded
      if (req.body.old_image) {
        const oldImagePath = "./uploads/" + req.body.old_image; // Ensure correct path
        try {
          fs.unlinkSync(oldImagePath); // Delete the old image
        } catch (err) {
          console.log("Error deleting old image:", err);
        }
      }
    } else {
      // If no new image is uploaded, retain the old image
      new_image = req.body.old_image;
    }

    // Update the testimonial with the new or old image
    await Testimonial.findByIdAndUpdate(id, {
      name: req.body.name,
      description: req.body.description,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
      testimonialImage: new_image,
      status: req.body.status || "active", // Ensure the status is updated, default is 'active'
    });

    req.session.message = {
      type: "success",
      message: "Testimonial updated successfully!",
    };
    res.redirect("/admin/all-testimonial");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//========================================================================== Delete Testimonial Controller Function
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).send("Testimonial not found");
    }
    const imagePath = path.join(
      __dirname,
      "../../",
      "uploads",
      testimonial.testimonialImage
    );
    try {
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.log("Error deleting image:", err);
    }
    await Testimonial.findByIdAndDelete(req.params.id);
    req.session.message = {
      type: "success",
      message: "Testimonial deleted successfully!",
    };
    res.redirect("/admin/all-testimonial");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};
const getAllTestimonialsForIndex = async () => {
  try {
    return await Testimonial.find();
  } catch (err) {
    throw new Error("Error fetching team");
  }
};
const getTestimonials = async (TestimonialId) => {
  try {
    return await Testimonial.findById(TestimonialId);
  } catch (err) {
    throw new Error("Error fetching blogs");
  }
};

//========================================================================== Exporting Controller Functions
module.exports = {
  getAllTestimonialsForIndex,
  getTestimonials,
  addTestimonial,
  addTestimonialPage,
  allTestimonials,
  updateTestimonial,
  deleteTestimonial,
  updateTestimonialPage,
};
