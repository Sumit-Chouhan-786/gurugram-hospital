const Blog = require("../../models/blogModel");
const path = require("path");
const fs = require("fs");

//========================================================================== Add Blog Controller Function
const addBlog = async (req, res) => {
  try {
    // Check if an image was uploaded
    if (!req.file) {
      req.session.message = {
        type: "danger",
        message: "Image upload failed. Please try again.",
      };
      return res.redirect("/admin/add-Blog");
    }

    // Create a new blog entry
    const blog = new Blog({
      title: req.body.title,
      heading: req.body.heading,
      description: req.body.description,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
      blogImage: req.file.filename,
      status: req.body.status || "active",
    });

    // Save the blog to the database
    await blog.save();

    // Set a success message
    req.session.message = {
      type: "success",
      message: "Blog added successfully!",
    };

    res.redirect("/admin/all-blogs");
  } catch (err) {
    console.error("Error adding blog:", err.message);
    req.session.message = {
      type: "danger",
      message: "An error occurred while adding the blog. Please try again.",
    };
    res.redirect("/admin/add-Blog");
  }
};

//========================================================================== Add Blog Page Controller Function
const addBlogPage = (req, res) => {
  const message = req.session.message || null;
  req.session.message = null; // Clear the session message after rendering
  res.render("admin-ui/addBlog.ejs", { message });
};

//========================================================================== All Blogs Controller Function
const allBlogs = async (req, res) => {
  try {
    // Fetch all blogs from the database
    const blogs = await Blog.find();

    res.render("admin-ui/allBlogs.ejs", {
      blogs, // Pass the blogs to the view for rendering
      message: req.session.message || null, // Display success/error messages
    });

    req.session.message = null; // Clear the session message
  } catch (err) {
    console.error("Error fetching blogs:", err.message);
    req.session.message = {
      type: "danger",
      message: "An error occurred while retrieving blogs. Please try again.",
    };
    res.redirect("/admin");
  }
};

//======================== update blog page render

const updateBlogPage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.render("admin-ui/updateBlog.ejs", {
      title: "Update Blog",
      blog: blog,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//========================================================================== Update Blog Controller Function
const updateBlog = async (req, res) => {
  const id = req.params.id;
  let new_image = "";

  try {
    if (req.file) {
      new_image = req.file.filename;

      // Delete the previous image if a new image is uploaded
      if (req.body.old_image) {
        const oldImagePath = "./uploads/" + req.body.old_image; // Ensure correct path
        try {
          fs.unlinkSync(oldImagePath); // Delete the old image
        } catch (err) {
          console.log("Error deleting old image:", err);
        }
      }
    } else {
      // If no new image is uploaded, retain the old image
      new_image = req.body.old_image;
    }

    // Update the blog with the new or old image
    await Blog.findByIdAndUpdate(id, {
      title: req.body.title,
      heading: req.body.heading,
      description: req.body.description,
      seoTitle: req.body.seoTitle,
      seoKeywords: req.body.seoKeywords,
      seoDescription: req.body.seoDescription,
      blogImage: new_image,
      status: req.body.status || "active",
    });

    req.session.message = {
      type: "success",
      message: "Blog updated successfully!",
    };
    res.redirect("/admin/all-blogs");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};



// Update blog fields

//========================================================================== Delete Blog Controller Function
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    const imagePath = path.join(__dirname, "../../", "uploads", blog.blogImage);
    try {
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.log("Error deleting image:", err);
    }
    await Blog.findByIdAndDelete(req.params.id);
    req.session.message = {
      type: "success",
      message: "Blog deleted successfully!",
    };
    res.redirect("/admin/all-blogs");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
};

//========================================================================== Exporting Controller Functions
module.exports = {
  addBlog,
  addBlogPage,
  allBlogs,
  updateBlog,
  deleteBlog,
  updateBlogPage,
};
