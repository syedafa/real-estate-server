const express = require("express");
const {
  createListing,
  deleteListing,
  updateListing,
  getListing,
} = require("../controllers/listing.controller");
const { verifyToken } = require("../utils/verifyUser");
const router = express.Router();
router.post("/create-list", verifyToken, createListing);
router.delete("/delete-list/:id", verifyToken, deleteListing);
router.post("/update-list/:id", verifyToken, updateListing);
router.get("/get-listing/:id", verifyToken, getListing);
module.exports = router;
