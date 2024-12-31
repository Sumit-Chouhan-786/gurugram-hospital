const videoGalleryController = {
  addVideoGalleryPage: (req, res) => {
    res.render("admin-ui/addVideoGallery.ejs");
  },
  allVideoGalleryPage: (req, res) => {
    res.render("admin-ui/allVideoGallery.ejs");
  },
};

module.exports = videoGalleryController;
