const express = require("express");
const { signup, signin, google } = require("../controllers/auth.controller.js");
const router = express.Router();
router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/google", google);
module.exports = router;
