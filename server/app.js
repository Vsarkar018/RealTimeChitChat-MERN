require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
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
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening to the port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
