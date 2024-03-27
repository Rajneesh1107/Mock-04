require("dotenv").config({});

const express = require("express");
const app = express();
const fs = require("fs");
const connection = require("./lib/db/mongodb");
const PORT = process.env.PORT || 8000;

//dynamically load routes;
app.use(express.json());
fs.readdirSync(`${__dirname}/routes/api`).map((file) => {
  require(`./routes/api/${file}`)(app);
});

app.listen(PORT, async () => {
  await connection();
  console.log(`server is running port at ${PORT}`);
});
