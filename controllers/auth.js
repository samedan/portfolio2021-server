const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

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
