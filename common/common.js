// utils/SiteSettingData.js
const SiteSetting = require("../models/siteSettingModel");
const Service = require("../models/serviceModel")
const SiteSettingData = async () => {
  try {
    const siteSettings = await SiteSetting.find(); 
    return siteSettings;
  } catch (err) {
    console.error("Error fetching site settings:", err.message);
    throw err; 
  }
};

const AllServicesData = async () => {
  try {
    const services = await Service.find();
    return services;
  } catch (err) {
    console.error("Error fetching services:", err.message);
    throw err;
  }
};

module.exports = {AllServicesData,SiteSettingData};
