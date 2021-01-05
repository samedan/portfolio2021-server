const express = require("express");
const server = express();
const { connect } = require("./db");

connect();

// GET /api/v1/portfolios
server.use("/api/v1/portfolios", require("./routes/portfolios"));

const PORT = process.env.PORT || 3001;

server.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log("Server ready on port: ", PORT);
});
