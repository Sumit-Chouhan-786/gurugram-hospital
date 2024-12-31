const GalleryImage = require("../../models/galleryImageModel");
const fs = require("fs");
const path = require("path");

//======================================================================== Add Gallery Image
const addGalleryImage = async (req, res) => {
  if (!req.file) {
    return res.json({ message: "Image upload failed", type: "danger" });
  }

  try {
    const galleryImage = new GalleryImage({
      galleryImage: req.file.filename,
    });

    await galleryImage.save();

    req.session.message = {
      type: "success",
      message: "Gallery image added successfully!",
    };
    res.redirect("/admin/all-image-gallery");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Render Add Gallery Image page
const addGalleryImagePage = (req, res) => {
  res.render("admin-ui/addImageGallery.ejs");
};

//======================================================================== Update Gallery Image controller function
const updateGalleryImage = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    // Check if a new image is uploaded
    if (req.file) {
      new_image = req.file.filename;
      // Optionally delete the old image from the server
      try {
        fs.unlinkSync("./uploads" + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }

    // Update the gallery image with the new or old image
    await GalleryImage.findByIdAndUpdate(id, {
      galleryImage: new_image,
    });

    // Set success message in session and redirect
    req.session.message = {
      type: "success",
      message: "Gallery image updated successfully!",
    };
    res.redirect("/admin/all-image-gallery");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== Render Update Gallery Image page
const updateGalleryImagePage = async (req, res) => {
  try {
    const galleryImage = await GalleryImage.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    res.render("admin-ui/updateImageGallery.ejs", {
      title: "Update Gallery Image",
      galleryImage: galleryImage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//======================================================================== Delete Gallery Image controller function
const deleteGalleryImage = async (req, res) => {
  try {
    // Find the gallery image by its ID
    const galleryImage = await GalleryImage.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).send("Gallery image not found");
    }

    // Get the image file path from the gallery image object
    const imagePath = path.join(
      __dirname,
      "../../",
      "uploads",
      galleryImage.galleryImage
    );

    // Delete the image file from the server
    try {
      fs.unlinkSync(imagePath); // Delete the file from the uploads folder
    } catch (err) {
      console.log("Error deleting image:", err);
    }

    // Now delete the gallery image record from the database
    await GalleryImage.findByIdAndDelete(req.params.id);

    // Set success message and redirect
    req.session.message = {
      type: "success",
      message: "Gallery image deleted successfully!",
    };
    res.redirect("/admin/all-image-gallery");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};

//======================================================================== All Gallery Images Page controller function
const allGalleryImagesPage = async (req, res) => {
  try {
    const galleryImages = await GalleryImage.find();

    res.render("admin-ui/allImageGallery.ejs", {
      galleryImages: galleryImages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching gallery images.");
  }
};

module.exports = {
  addGalleryImagePage,
  addGalleryImage,
  updateGalleryImagePage,
  updateGalleryImage,
  allGalleryImagesPage,
  deleteGalleryImage,
};
