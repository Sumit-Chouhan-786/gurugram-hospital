const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specList: {
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
    teamImage: {
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

module.exports = mongoose.model("Team", teamSchema);


