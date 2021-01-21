const express = require("express");
const {
  getBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
} = require("../controllers/blogs");
const { checkJwt, checkRole } = require("../controllers/auth");

const router = express.Router();

// GET api/v1/portfolios
router.get("", getBlogs);
router.get("/:id", getBlogById);
router.get("/s/:slug", getBlogBySlug);

router.post("", checkJwt, checkRole("admin"), createBlog);

module.exports = router;
