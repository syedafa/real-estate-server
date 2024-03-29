const express = require("express");
const {
  signup,
  signin,
  google,
  signOut,
  forgetPassword,
  resetPassword,
  signUpVerification,
} = require("../controllers/auth.controller.js");
const router = express.Router();
router.post("/sign-up", signup);
router.get("/verify/:id/:token", signUpVerification);
router.post("/sign-in", signin);
router.post("/google", google);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.get("/signout", signOut);
module.exports = router;
