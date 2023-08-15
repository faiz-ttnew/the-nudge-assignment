const { dbConnection } = require("./config/dbConnection");
require("dotenv").config();
const { routeConfig } = require("./config/router");
const express = require("express");

const server = express();
const cors = require("cors");

server.get("/", (req, res) => {
  res.json({ status: "success", userName });
});

async function startServer() {
  server.use(
    cors({
      exposedHeaders: ["X-Total-Count"],
    })
  );

  server.use(express.json()); // to parse req.body

  await routeConfig(server);

  await dbConnection();

  server.listen(process.env.PORT, () => {
    console.log("server started " + process.env.PORT);
  });
}

startServer();
