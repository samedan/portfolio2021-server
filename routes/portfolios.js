const express = require("express");
const {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
} = require("../controllers/portfolios");
const { checkJwt } = require("../controllers/auth");

const router = express.Router();

// GET api/v1/portfolios
router.get(
  "",
  (req, res, next) => {
    if (err) {
      res.status(422).send("Error");
    }
    next();
  },
  getPortfolios
);

// GET api/v1/portfolios/id
router.get("/:id", getPortfolioById);

// POST api/v1/portfolios
router.post("/", checkJwt, createPortfolio);

module.exports = router;
