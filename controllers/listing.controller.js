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
module.exports.getListings = async (req, res, next) => {
  // console.log(req.query);
  try {
    // const listing = await Listing.findById(req.params.id);
    const limit = parseInt(req.query.limit) || 9;
    const skip = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [true, false] };
    } else {
      offer = { $in: [true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    } else {
      furnished = { $in: [true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    } else {
      parking = { $in: [true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.search || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(skip);
    console.log(listings);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
