const Listing = require("../model/listing.model");
const { errorHandler } = require("../utils/error");

module.exports.createListing = async (req, res, next) => {
  try {
    const newList = await Listing.create(req.body);
    res.status(201).json(newList);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "you can delete only your listings"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("listing has been deleted successfully");
  } catch (error) {
    next(error);
  }
};
module.exports.updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "you can update only your listings"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
module.exports.getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "listing not found"));
    } else {
      console.log(listing);
      res.status(200).send(listing);
    }
  } catch (error) {
    next(error);
  }
};
