const { Mongoose } = require("mongoose");
const mongoose = require("mongoose");

const Portfolio = mongoose.model("Portfolio");

exports.getPortfolios = async (req, res) => {
  const portfolios = await Portfolio.find({});
  return res.json(portfolios);
};

exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    return res.json(portfolio);
  } catch (error) {
    // return res.status(422).send(error.message);
    return res.status(422).send("Fetching error");
  }
};

exports.createPortfolio = async (req, res) => {
  const portfolioData = req.body;
  // TODO: extract user form request
  const userId = "google-oauth2|112429623858074152886";

  // instance on server
  const portfolio = new Portfolio(portfolioData);
  portfolio.userId = userId;
  try {
    const newPortfolio = await portfolio.save();
    return res.json(newPortfolio);
  } catch (error) {
    return res.status(422).send(error.message);
  }
};
