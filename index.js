require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const Page = require("./models/pageModel");
const { SiteSettingData } = require("./common/common");
const { AllServicesData } = require("./common/common");
require("./db/connection");

// Routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(cookieParser());

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Define the port and host for the server
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

// Middleware for logging HTTP requests
app.use(morgan("dev"));

// Middleware for parsing form data and JSON requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware to fetch site settings globally
app.use(async (req, res, next) => {
  try {
    const siteSettings = await SiteSettingData();
    res.locals.siteSettings = siteSettings;
    next();
  } catch (err) {
    console.error("Error in site settings middleware:", err);
    next();
  }
});
app.use(async (req, res, next) => {
  try {
    const allServices = await AllServicesData();

    // Filter services by categories
    const adultCardiacServices = allServices.filter(
      (service) => service.category === "Adult cardiac disease"
    );
    const pediatricCardiacServices = allServices.filter(
      (service) => service.category === "Pediatric Cardiac Disease"
    );
    const cardiacArrhythmiaServices = allServices.filter(
      (service) => service.category === "Cardiac Arrhythmia"
    );
    const heartFailureServices = allServices.filter(
      (service) => service.category === "Heart Failure"
    );

    // Pass each filtered category as separate variables to the view
    res.locals.adultCardiacServices = adultCardiacServices;
    res.locals.pediatricCardiacServices = pediatricCardiacServices;
    res.locals.cardiacArrhythmiaServices = cardiacArrhythmiaServices;
    res.locals.heartFailureServices = heartFailureServices;

    next();
  } catch (err) {
    console.error("Error in site settings middleware:", err);
    next();
  }
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Use 'secure: true' when running in https environment
  })
);

// Middleware to handle flash messages
app.use((req, res, next) => {
  res.locals.message = req.session.message || null;
  delete req.session.message; // Remove the message after it's displayed
  next();
});

// Serve static files (CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve uploaded files (e.g., images) from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up the views folder and EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes for admin functionality
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

// Error handling middleware (optional, for future use)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Internal Server Error");
});



app.get("/:url", (req, res) => {
  const url = req.params.url;
  console.log("Requested URL:", url);

  Page.findOne({ url, status: "active" })
    .then((page) => {
      if (page) {
        console.log("Page Data:", page); // Log the page data
        res.render("user-ui/dynamicPage.ejs", {
          name: page.name,
          heading: page.heading,
          description: page.description,
          seoTitle: page.seoTitle,
          seoKeywords: page.seoKeywords,
          seoDescription: page.seoDescription,
          pageImage: page.pageImage,
        });
      } else {
        console.log("Page not found for URL:", url);
        res.status(404).render("user-ui/error");
      }
    })
    .catch((err) => {
      console.error("Error finding page:", err);
      res.status(500).send("Error: " + err.message);
    });
});
app.all("*", (req, res) => {
  res.render("user-ui/error");
}); 

// Start the Express server
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
