const mongoose = require("mongoose");

const Blog = mongoose.model("Blog");

exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: "published" })
    // descending order, newest one first
    .sort({ createdAt: -1 });

  return res.json(blogs);
};
exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  return res.json(blog);
};
exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  return res.json(blog);
};

exports.createBlog = async (req, res) => {
  const blogData = req.body;
  blogData.userId = req.user.sub;
  // create instance
  const blog = new Blog(blogData);
  try {
    const createdBlog = await blog.save();
    return res.json(createdBlog);
  } catch (e) {
    return res.status(422).send(e.message);
  }
};

exports.updateBlog = async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  Blog.findById(id, async (err, blog) => {
    if (err) {
      return res.status(422).send(err.message);
    }

    // TODO check if user is publishing blog,
    // create slug

    blog.set(body); // interbnal instance
    blog.updatedAt = new Date();
    try {
      const updatedBlog = await blog.save();
      return res.json(updatedBlog);
    } catch (error) {
      return res.status(422).send(error.message);
    }
  });
};