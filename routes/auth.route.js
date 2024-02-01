const express = require("express");
const { signup } = require("../controllers/auth.controller.js");
const router = express.Router();
router.post("/sign-up", signup);
module.exports = router;
