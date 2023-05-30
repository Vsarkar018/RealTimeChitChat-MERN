require("dotenv").config();
require("express-async-errors");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const connectDB = require("./db/connect");
connectDB(process.env.MONGO_URI);
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authMiddleware = require("./middleware/auth");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/notFound");
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chats", authMiddleware, chatRoutes);
app.use("/api/v1/msgs", authMiddleware, messageRoutes);

//_______For Deployement_________
if (process.env.NODE_ENV === "production") {
  app.use(express.static('./public/build'));
} else {
  app.get("/", (req, res) => {
    res.status(200).send("API is Running");
  });
}
//_______For Deployement_________
app.use(notFound);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;
const server = app.listen(
  port,
  console.log(`Server is listening to the port ${port}`)
);

const io = socketio(server, {
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log(`User joined room : ${room}`);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stopTyping", (room) => {
    socket.in(room).emit("stopTyping");
  });
  socket.on("sendMessage", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) {
      return console.log("Chat.users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
        return;
      }
      socket.in(user._id).emit("messageRecieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
