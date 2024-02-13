const Listing = require("../model/listing.model");

module.exports.createListing = async (req, res, next) => {
  try {
    const newList = await Listing.create(req.body);
    res.status(201).json(newList);
  } catch (error) {
    next(error);
  }
};
