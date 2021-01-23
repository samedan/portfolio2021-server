const express = require("express");
const {
  getBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  getBlogsByUser,
} = require("../controllers/blogs");
const { checkJwt, checkRole } = require("../controllers/auth");

const router = express.Router();

// GET api/v1/portfolios
router.get("", getBlogs);
router.get("/me", checkJwt, checkRole("admin"), getBlogsByUser); // order is important
router.get("/:id", getBlogById);
router.get("/s/:slug", getBlogBySlug);

router.post("", checkJwt, checkRole("admin"), createBlog);
router.patch("/:id", checkJwt, checkRole("admin"), updateBlog);

module.exports = router;
