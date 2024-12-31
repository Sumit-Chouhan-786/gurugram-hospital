const dashboardController = {
  dashboard: (req, res) => {
    res.render("admin-ui/index.ejs"); 
  },
};

module.exports = dashboardController;
