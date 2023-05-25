const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../Error");
const Chat = require("../models/chat");
const User = require("../models/user");

const accessChats = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new BadRequest("UserId not present in request");
  }
  var isChat = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.user._id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  let chat;
  if (isChat.length > 0) {
    chat = isChat[0];
  } else {
    const createdChat = await Chat.create({
      chatName: "sender",
      isGroup: false,
      users: [req.user._id, userId],
    });
    chat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
  }
  res.status(StatusCodes.OK).json(chat);
};

const fetchChats = async (req, res) => {
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  res.status(StatusCodes.OK).json(chats);
};
const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    throw new BadRequest("Please Fill the Details");
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    throw new BadRequest("More than 2 users required");
  }
  users.push(req.user);
  const groupChat = await Chat.create({
    chatName: req.body.name,
    users: users,
    isGroup: true,
    groupAdmin: req.user,
  });

  const groupChatWithDetails = await Chat.findOne({
    _id: groupChat._id,
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(StatusCodes.OK).json(groupChatWithDetails);
};
const renameGroup = async (req, res) => {
  const updatedChat = await Chat.findByIdAndUpdate(
    req.body.chatId,
    {
      chatName: req.body.chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    throw new NotFound("Chat not found");
  }
  res.status(StatusCodes.OK).json(updatedChat);
};
const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const add = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  );
  if (!add) {
    throw new NotFound("Chat not Found");
  }
  res.status(StatusCodes.OK).json(add);
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  );
  if (!remove) {
    throw new NotFound("Chat not Found");
  }
  res.status(StatusCodes.OK).json(remove);
};

module.exports = {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
