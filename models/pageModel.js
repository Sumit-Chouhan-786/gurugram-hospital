  const mongoose = require("mongoose");

  const pageSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      heading: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },
      seoTitle: {
        type: String,
        required: true,
      },
      seoKeywords: {
        type: String,
        required: true,
      },
      seoDescription: {
        type: String,
        required: true,
      },
      pageImage: {
        type: String,
        require: true,
      },
      status: {
        type: String,
        enum: ["active", "deactive"],
        default: "active",
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Page", pageSchema);
