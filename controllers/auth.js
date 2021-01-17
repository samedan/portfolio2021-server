const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const config = require("../config/dev");

// Authentication middleware
exports.checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: "https://popescudaniel.eu.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://popescudaniel.eu.auth0.com/api/v2/",
  issuer: "https://popescudaniel.eu.auth0.com/",
  algorithms: ["RS256"],
});

// Role of user Check
exports.checkRole = (role) => (req, res, next) => {
  // checkJwt assures there is a user
  const user = req.user;

  if (user && user[config.AUTH0_NAMESPACE + "/roles"].includes(role)) {
    next();
  } else {
    return res
      .status(401)
      .send("You are not authorized to access this resource");
  }
};
