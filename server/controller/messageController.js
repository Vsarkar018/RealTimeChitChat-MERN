const { BadRequest } = require("../Error/index");
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");
const { StatusCodes } = require("http-status-codes");
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    throw new BadRequest("Invalid data passed into request");
  }
  let message = await Message.create({
    sender: req.user._id,
    content: content,
    chat: chatId,
  });
  message = await message.populate("sender", "name pic");
  message = await message.populate("chat");

  message = await User.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });
  await Chat.findByIdAndUpdate(req.body.chatId, {
    latestMessage: message,
  });
  res.status(StatusCodes.OK).json(message);
};
const allMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name pic email")
    .populate("chat");
  res.status(StatusCodes.OK).json(messages);
};
module.exports = { sendMessage, allMessages };
