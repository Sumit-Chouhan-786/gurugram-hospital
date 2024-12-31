const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
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
  blogImage: {
    type: String,
    require:true
  },
  status: {
    type: String,
    enum: ["active", "deactive"],
    default: "active",
  },
 
}, { timestamps: true } );

module.exports = mongoose.model("Blog", blogSchema);


