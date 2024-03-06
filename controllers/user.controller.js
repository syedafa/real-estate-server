const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const User = require("../model/user.model");
const Listing = require("../model/listing.model");

module.exports.test = (req, res) => {
  res.json({
    message: "hi afan dfdf",
  });
};
module.exports.updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your account"));
  try {
    // const updateUser = req.body;
    // console.log(updateUser);

    // if (req.body.password) {
    //   console.log(req.body.password);
    //   hasedPassword = bcryptjs.hashSync(req.body.password, 10);
    // }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          avathar: req.body.avathar,
        },
      },
      { new: true }
    );
    // const { password, ...rest } = updatedUser._doc;
    // const updatingUser = await User.findById(req.params.id);
    // console.log(updatingUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
module.exports.deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return errorHandler(401, "you can delete your own account");
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted").clearCookie("access_token");
  } catch (error) {
    next(error);
  }
};

module.exports.getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "you can view your own listings"));
  }
};
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "user not found"));
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
