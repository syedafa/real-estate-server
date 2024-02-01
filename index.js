const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to mongo db successfully");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(8080, () => {
  console.log("app is running on port 8080");
});
