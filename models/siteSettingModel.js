const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: String, required: true },
    alterNumber: { type: String },
    whatsappNumber: { type: String, required: false },
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    instagram: { type: String, required: false },
    telegram: { type: String, required: false },
    youtube: { type: String, required: false },
    linkedin: { type: String, required: false },
    location: { type: String, required: false },
    logo: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
