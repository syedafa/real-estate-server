const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const nodemailer = require("nodemailer");
module.exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("new user created successfully");
  } catch (err) {
    next(err);
  }
};
module.exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User Not Found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
module.exports.google = async (req, res, next) => {
  const { name, email, photo } = req.body;
  console.log(name, email, photo);
  try {
    const user = await User.findOne({ email });
    // console.log(email);
    if (user) {
      console.log("first");
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          name.split(" ").join("") + Math.random().toString(36).slice(-8),
        email,
        password: hashedPassword,
        avathar: photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(201)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
module.exports.signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out ");
  } catch (error) {
    next(error);
  }
};
module.exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const validUser = await User.findOne({ email });
    console.log(validUser);
    if (!validUser) return next(errorHandler(404, "User Not Found"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "afwaan3@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: "youremail@gmail.com",
      to: validUser.email,
      subject: "reset password",
      text: `http://127.0.0.1:5173/reset-password/${validUser._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).json({
      token: token,
      id: validUser._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;

  if (!token) return next(errorHandler(401, "Unauthorized"));
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return next(errorHandler(403, "forbidden"));
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    res.status(200).json("Password Updated Successfully");
  });
};
