const express = require("express");
const {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require("../controllers/portfolios");
const { checkJwt, checkRole } = require("../controllers/auth");

const router = express.Router();

// GET api/v1/portfolios
router.get("", getPortfolios);

// GET api/v1/portfolios/id
router.get("/:id", getPortfolioById);

// POST api/v1/portfolios
router.post("/", checkJwt, checkRole("admin"), createPortfolio);

// PATCH api/v1/portfolios/id
router.patch("/:id", checkJwt, checkRole("admin"), updatePortfolio);

// DELETE api/v1/portfolios/id
router.delete("/:id", checkJwt, checkRole("admin"), deletePortfolio);

module.exports = router;
