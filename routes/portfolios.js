const express = require("express");
const { getPortfolios } = require("../controllers/portfolios");

const router = express.Router();

router.get("", getPortfolios);

module.exports = router;
