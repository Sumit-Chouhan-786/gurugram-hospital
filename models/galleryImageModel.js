const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    galleryImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryImage", gallerySchema);
