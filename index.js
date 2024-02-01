const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
dotenv.config();
app.use(express.json());
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
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
