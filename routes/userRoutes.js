const express = require("express");
const router = express.Router();
const getAllTeamsForAbout = require("../controllers/admin/teamController")
const getAllServicesIndex = require("../controllers/admin/servicesController");
const getAllTestimonialsForIndex = require("../controllers/admin/testimonialController");
const getAllBlogsForIndex = require("../controllers/admin/blogController");
const getAllSliderIndex = require("../controllers/admin/sliderController");


// Route to fetch and render all services for the index page
router.get("/", async (req, res) => {
  try {
    // Fetch services and testimonials asynchronously
    const services = await getAllServicesIndex.getAllServicesIndex();
     const teams = await getAllTeamsForAbout.getAllTeamsForAbout(); 
    const testimonials = await getAllTestimonialsForIndex.getAllTestimonialsForIndex();
    const blogs = await getAllBlogsForIndex.getAllBlogsForIndex();
    const sliders = await getAllSliderIndex.getAllSliderIndex();

    // Render the index page with fetched data
    res.render("user-ui/index", {
      services,
      testimonials,
      blogs,
      sliders,
      teams,
    });
  } catch (err) {
    console.error("Error fetching data for the index page:", err); 

    // Render an error page with a friendly message
    res.status(500).render("error", {
      title: "Error",
      message:
        "An error occurred while loading the page. Please try again later.",
    });
  }
});

module.exports = router;

// Route to fetch and render details for a specific service
router.get("/blog-details/:id", async (req, res) => {
  try {
    const blogId = req.params.id; // Extract the service ID from the URL
     const blogs = await getAllBlogsForIndex.getAllBlogsForIndex();
    const blog = await getAllBlogsForIndex.getBlog(blogId); // Fetch specific service by ID

    if (!blog) {
      // Handle case where no service is found
      console.error(`blog with ID ${blogId} not found.`);
      return res.status(404).render("error", {
        title: "blog Not Found",
        message: "The requested service details could not be found.",
      });
    }

    // Render the service-details page with the fetched service data
    res.render("../views/user-ui/blog-details.ejs", { blog, blogs });
  } catch (err) {
    console.error("Error fetching blog details:", err.message);

    // Handle server error
    res.status(500).render("error", {
      title: "Error",
      message: "An error occurred while loading the blog details. Please try again later.",
    });
  }
});

// Route to fetch and render details for a specific service
router.get("/service-details/:id", async (req, res) => {
  try {
    const serviceId = req.params.id; // Extract the service ID from the URL
    const service = await getAllServicesIndex.getService(serviceId); // Fetch specific service by ID

    if (!service) {
      // Handle case where no service is found
      console.error(`Service with ID ${serviceId} not found.`);
      return res.status(404).render("error", {
        title: "Service Not Found",
        message: "The requested service details could not be found.",
      });
    }

    console.log("Service Details:", service);

    // Render the service-details page with the fetched service data
    res.render("../views/user-ui/service-details.ejs", { service });
  } catch (err) {
    console.error("Error fetching service details:", err.message);

    // Handle server error
    res.status(500).render("error", {
      title: "Error",
      message: "An error occurred while loading the service details. Please try again later.",
    });
  }
});

router.get("/about", async (req, res) => {
  try {
    const blogs = await getAllBlogsForIndex.getAllBlogsForIndex();
    const teams = await getAllTeamsForAbout.getAllTeamsForAbout(); 
    res.render("../views/user-ui/about.ejs", { teams, blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching doctors and sliders.");
  }
});
router.get("/team-details/:id", async (req, res) => {
  try {
    const teamId = req.params.id; 
    const team = await getAllTeamsForAbout.getTeam(teamId); 

    if (!team) {
      // Handle case where no team is found
      console.error(`Team with ID ${teamId} not found.`);
      return res.status(404).render("error", {
        title: "Team Not Found",
        message: "The requested team details could not be found.",
      });
    }

    console.log("Team Details:", team);

    // Render the team-details page with the fetched team data
    res.render("../views/user-ui/team-details.ejs", { team });
  } catch (err) {
    console.error("Error fetching team details:", err.message);

    // Render an error page for unexpected server errors
    res.status(500).render("error", {
      title: "Error",
      message:
        "An error occurred while loading the team details page. Please try again later.",
    });
  }
});
router.get("/blog", (req, res) => {
  res.render("../views/user-ui/blog.ejs");
});

router.get("/contact", (req, res) => {
  res.render("../views/user-ui/contact.ejs");
});

router.get("/adult-cardiac-disease", async (req, res) => {
    try {
    // Fetch services and testimonials asynchronously
    const services = await getAllServicesIndex.getAllServicesIndex();

    // Render the index page with fetched data
    res.render("user-ui/adult-cardiac-disease", { services });
  } catch (err) {
    console.error("Error fetching data for the index page:", err); 

    // Render an error page with a friendly message
    res.status(500).render("error", {
      title: "Error",
      message:
        "An error occurred while loading the page. Please try again later.",
    });
  }
});

router.get("/pediatric-cardiac-disease", (req, res) => {
  res.render("../views/user-ui/pediatric-cardiac-disease.ejs");
});
router.get("/cardiac-arrhythmia", (req, res) => {
  res.render("../views/user-ui/cardiac-arrhythmia.ejs");
});
router.get("/health-failure", (req, res) => {
  res.render("../views/user-ui/health-failure.ejs");
});




module.exports = router;
