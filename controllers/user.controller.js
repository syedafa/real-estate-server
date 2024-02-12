const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const User = require("../model/user.model");

module.exports.test = (req, res) => {
  res.json({
    message: "hi afan dfdf",
  });
};
module.exports.updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your account"));
  try {
    if (req.body.password) {
      console.log(req.body.password);
      hasedPassword = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: hasedPassword,
          avathar: req.body.avathar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
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
