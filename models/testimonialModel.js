const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
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
    testimonialImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "deactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("testimonial", testimonialSchema);
