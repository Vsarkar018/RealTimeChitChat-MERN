const { BadRequest, Unauthorized } = require("../Error/index");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    throw new BadRequest("Invalid Input");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new BadRequest("User already Exist");
  }
  const user = await User.create({ name, email, password, pic });
  if (user) {
    const token = user.CreateJwt();
    res.status(StatusCodes.OK).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: token,
    });
  }
  throw new BadRequest("Failed to create the user");
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Invalid Email or password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("Account does not exist");
  }
  const isMatch = await user.ComparePassword(password);
  if (!isMatch) {
    throw new Unauthorized("Invalid Password");
  }
  const token = user.CreateJwt();
  res.status(StatusCodes.OK).json({
    _id: user._id,
    name: user.name,
    pic: user.pic,
    email: user.email,
    token: token,
  });
};

const getUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  res.status(StatusCodes.OK).json(users);
};
const getAllUsers = async (req, res) => {
  const users = await User.find()
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  res.status(StatusCodes.OK).json(users);
};
module.exports = { registerUser, loginUser, getUsers, getAllUsers };
