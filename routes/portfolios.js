const express = require("express");
const {
  getPortfolios,
  getPortfolioById,
} = require("../controllers/portfolios");

const router = express.Router();

//api/v1/portfolios
router.get("", getPortfolios);

///api/v1/portfolios/id
router.get("/:id", getPortfolioById);

module.exports = router;
