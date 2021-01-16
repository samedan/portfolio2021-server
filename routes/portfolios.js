const express = require("express");
const {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require("../controllers/portfolios");
const { checkJwt } = require("../controllers/auth");

const router = express.Router();

// GET api/v1/portfolios
router.get(
  "",
  // (req, res, next) => {
  //   if (err) {
  //     res.status(422).send("Error");
  //   }
  //   next();
  // },
  getPortfolios
);

// GET api/v1/portfolios/id
router.get("/:id", getPortfolioById);

// POST api/v1/portfolios
router.post("/", checkJwt, createPortfolio);

// PATCH api/v1/portfolios/id
router.patch("/:id", checkJwt, updatePortfolio);

// DELETE api/v1/portfolios/id
router.delete("/:id", checkJwt, deletePortfolio);

module.exports = router;
