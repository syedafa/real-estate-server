const express = require("express");
const {
  signup,
  signin,
  google,
  signOut,
} = require("../controllers/auth.controller.js");
const router = express.Router();
router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/google", google);
router.get("/signout", signOut);
module.exports = router;
