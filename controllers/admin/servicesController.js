const Service = require("../../models/serviceModel"); 
const path = require("path");
const fs = require("fs");

// =========================================================================== Add Service Controller Function
const addService = async (req, res) => {
  try {
    if (!req.file) {
      req.session.message = {
        type: "danger",
        message: "Image upload failed. Please try again.",
      };
      return res.redirect("/admin/add-service");
    }

 
    const service = new Service({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      image: req.file.filename,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
      status: req.body.status || "active",
    });

    await service.save();

    req.session.message = {
      type: "success",
      message: "Service added successfully!",
    };

    res.redirect("/admin/all-services");
  } catch (err) {
    console.error("Error adding service:", err.message);
    req.session.message = {
      type: "danger",
      message: "An error occurred while adding the service. Please try again.",
    };
    res.redirect("/admin/add-service");
  }
};

// =========================================================================== Add Service Page Controller Function
const addServicePage = (req, res) => {
  const message = req.session.message || null;
  req.session.message = null;
  res.render("admin-ui/addServices.ejs", { message });
};

// =========================================================================== All Services Controller Function
const allServices = async (req, res) => {
  try {
    // Fetch all services from the database
    const services = await Service.find();

    res.render("admin-ui/allServices.ejs", {
      services, 
      message: req.session.message || null, 
    });

    req.session.message = null; // Clear the session message
  } catch (err) {
    console.error("Error fetching services:", err.message);
    req.session.message = {
      type: "danger",
      message: "An error occurred while retrieving services. Please try again.",
    };
    res.redirect("/admin");
  }
};

//======================== Update Service Page Render
const updateServicePage = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.render("admin-ui/updateServices.ejs", {
      title: "Update Service",
      service: service,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================================================================== Update Service Controller Function
const updateService = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    if (req.file) {
      new_image = req.file.filename;

      if (req.body.old_image) {
        const oldImagePath = "./uploads/" + req.body.old_image; 
        try {
          fs.unlinkSync(oldImagePath); 
        } catch (err) {
          console.log("Error deleting old image:", err);
        }
      }
    } else {
      new_image = req.body.old_image;
    }

    await Service.findByIdAndUpdate(id, {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      image: new_image,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
      status: req.body.status || "active",
    });

    req.session.message = {
      type: "success",
      message: "Service updated successfully!",
    };
    res.redirect("/admin/all-services");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

// =========================================================================== Delete Service Controller Function
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).send("Service not found");
    }
    const imagePath = path.join(__dirname, "../../", "uploads", service.image);
    try {
      fs.unlinkSync(imagePath); // Delete the service image from the file system
    } catch (err) {
      console.log("Error deleting image:", err);
    }
    await Service.findByIdAndDelete(req.params.id);
    req.session.message = {
      type: "success",
      message: "Service deleted successfully!",
    };
    res.redirect("/admin/all-services");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};

const getAllServicesIndex = async () => {
  try {
    return await Service.find();
  } catch (err) {
    throw new Error("Error fetching team");
  }
};
const getService = async (ServiceId) => {
  try {
    return await Service.findById(ServiceId);
  } catch (err) {
    throw new Error("Error fetching blogs");
  }
};

// =========================================================================== Exporting Controller Functions
module.exports = {
  addService,
  getAllServicesIndex,
  getService,
  addServicePage,
  allServices,
  updateService,
  deleteService,
  updateServicePage,
};
