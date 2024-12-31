// utils/SiteSettingData.js
const SiteSetting = require("../models/siteSettingModel");

const SiteSettingData = async () => {
  try {
    const siteSettings = await SiteSetting.find(); 
    return siteSettings;
  } catch (err) {
    console.error("Error fetching site settings:", err.message);
    throw err; 
  }
};

module.exports = SiteSettingData;
