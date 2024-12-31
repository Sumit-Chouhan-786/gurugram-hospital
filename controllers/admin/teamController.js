const Team = require("../../models/teamModel");
const path = require("path");
const fs = require("fs");

//========================================================================== Add Team Controller Function
const addTeam = async (req, res) => {
  try {
    // Check if an image was uploaded
    if (!req.file) {
      req.session.message = {
        type: "danger",
        message: "Image upload failed. Please try again.",
      };
      return res.redirect("/admin/add-team");
    }

    // Create a new team entry
    const team = new Team({
      name: req.body.name,
      specList: req.body.specList,
      description: req.body.description,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
      teamImage: req.file.filename,
      status: req.body.status || "active",
    });

    // Save the team to the database
    await team.save();

    // Set a success message
    req.session.message = {
      type: "success",
      message: "Team added successfully!",
    };

    res.redirect("/admin/all-team");
  } catch (err) {
    console.error("Error adding team:", err.message);
    req.session.message = {
      type: "danger",
      message: "An error occurred while adding the team. Please try again.",
    };
    res.redirect("/admin/add-team");
  }
};

//========================================================================== Add Team Page Controller Function
const addTeamPage = (req, res) => {
  const message = req.session.message || null;
  req.session.message = null; // Clear the session message after rendering
  res.render("admin-ui/addTeam.ejs", { message });
};

//========================================================================== All Teams Controller Function
const allTeams = async (req, res) => {
  try {
    // Fetch all teams from the database
    const teams = await Team.find();

    res.render("admin-ui/allTeams.ejs", {
      teams, // Pass the teams to the view for rendering
      message: req.session.message || null, // Display success/error messages
    });

    req.session.message = null; // Clear the session message
  } catch (err) {
    console.error("Error fetching teams:", err.message);
    req.session.message = {
      type: "danger",
      message: "An error occurred while retrieving teams. Please try again.",
    };
    res.redirect("/admin");
  }
};

//======================== Update Team Page Render
const updateTeamPage = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.render("admin-ui/updateTeam.ejs", {
      title: "Update Team",
      team: team,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//========================================================================== Update Team Controller Function
const updateTeam = async (req, res) => {
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

    // Update the team with the new or old image
    await Team.findByIdAndUpdate(id, {
      name: req.body.name,
      specList: req.body.specList,
      description: req.body.description,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
      teamImage: new_image,
      status: req.body.status || "active",
    });

    req.session.message = {
      type: "success",
      message: "Team updated successfully!",
    };
    res.redirect("/admin/all-team");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//========================================================================== Delete Team Controller Function
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).send("Team not found");
    }
    const imagePath = path.join(__dirname, "../../", "uploads", team.teamImage);
    try {
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.log("Error deleting image:", err);
    }
    await Team.findByIdAndDelete(req.params.id);
    req.session.message = {
      type: "success",
      message: "Team deleted successfully!",
    };
    res.redirect("/admin/all-team");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};
const getAllTeamsForAbout = async () => {
  try {
    return await Team.find();
  } catch (err) {
    throw new Error("Error fetching team");
  }
};
const getTeam = async (TeamId) => {
  try {
    return await Team.findById(TeamId);
  } catch (err) {
    throw new Error("Error fetching blogs");
  }
};

//========================================================================== Exporting Controller Functions
module.exports = {
  addTeam,
  getTeam,
  addTeamPage,
  allTeams,
  updateTeam,
  deleteTeam,
  getAllTeamsForAbout,
  updateTeamPage,
};
