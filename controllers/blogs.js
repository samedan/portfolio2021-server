const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueSlug = require("unique-slug");
const Blog = mongoose.model("Blog");

exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: "published" })
    // descending order, newest one first
    .sort({ createdAt: -1 });

  return res.json(blogs);
};
exports.getBlogsByUser = async (req, res) => {
  const userId = req.user.sub;
  const blogs = await Blog.find({ userId });
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

const _saveBlog = async (blog) => {
  try {
    const createdBlog = await blog.save();
    return createdBlog;
  } catch (e) {
    // verify TYPE of error (slug)
    if (e.code === 11000 && e.keyPattern && e.keyPattern.slug) {
      // add to the slug
      blog.slug += `-${uniqueSlug()}`;
      return _saveBlog(blog);
    } else {
      throw e;
    }
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
    if (body.status && body.status === "published" && !blog.slug) {
      blog.slug = slugify(blog.title, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: "vi", // language code of the locale to use
      });
    }

    blog.set(body); // interbnal instance
    blog.updatedAt = new Date();
    try {
      const updatedBlog = await _saveBlog(blog);
      return res.json(updatedBlog);
    } catch (error) {
      return res.status(422).send(error.message);
    }
  });
};
