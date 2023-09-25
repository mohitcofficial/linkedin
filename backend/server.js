import app from "./app.js";
import { connectDB } from "./config/database.js";
import { Server } from "socket.io";
import http from "http";
import { catchAsyncError } from "./middleware/catchAsyncError.js";
import { Message } from "./models/Message.js";
import { Conversation } from "./models/Conversation.js";
import cloudinary from "cloudinary";

connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
const onlineUserList = new Map();

app.get("/", (req, res) => {
  res.send("<h1>Working Fine</h1>");
});

app.route("/users").get((req, res, next) => {
  res.status(200).json({
    users: [],
    success: false,
  });
});

app.route("/api/user/status/:id").get((req, res, next) => {
  const userId = req.params.id;

  let check = false;
  for (const value of onlineUserList.values()) {
    if (value === userId) {
      check = true;
      break;
    }
  }

  if (check) {
    res.status(201).json({
      success: true,
      status: "Online",
    });
  } else {
    res.status(201).json({
      success: true,
      status: "Offline",
    });
  }
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socketio with id: ", socket.id);

  //user joined app
  socket.on("user-joined", async (userInfo) => {
    if (!userInfo) return;
    const userId = userInfo._id;
    onlineUserList.set(socket.id, userId);
    console.log(onlineUserList);

    const conversationIds = await Conversation.find(
      { users: { $elemMatch: { $eq: userId } } },
      { _id: 1 }
    );

    // socket.join("room1");
    if (conversationIds.length != 0)
      conversationIds.map(async (conversation) => {
        await socket.join(conversation._id.toString());
      });
    // socket.join("room1");
    if (conversationIds.length != 0)
      conversationIds.map((conversation) => {
        socket.broadcast.to(conversation._id.toString()).emit("user-connected");
      });
  });

  //user disconnected
  socket.on("disconnect", () => {
    const currentId = onlineUserList.get(socket.id);
    io.emit("userDisconnected", currentId);
    onlineUserList.delete(socket.id);
  });
  socket.on("logout", async () => {
    const currentId = onlineUserList.get(socket.id);
    io.emit("userDisconnected", currentId);
    onlineUserList.delete(socket.id);
    const conversationIds = await Conversation.find(
      { users: { $elemMatch: { $eq: currentId } } },
      { _id: 1 }
    );

    // socket.join("room1");
    if (conversationIds.length != 0)
      conversationIds.map(async (conversation) => {
        await socket.leave(conversation._id.toString());
      });
  });

  //join new room
  socket.on("join_room", (conversationId) => {
    socket.join(conversationId);
  });

  // user typing
  socket.on("typing", (conversationId) => {
    socket.broadcast.to(conversationId).emit("typing");
  });

  // user stopped typing
  socket.on("stop-typing", (conversationId) => {
    socket.broadcast.to(conversationId).emit("stop-typing");
  });

  //new message
  socket.on(
    "new-message",
    catchAsyncError(async (message, conversationId, senderId) => {
      const newMessage = await Message.create({
        conversationId: conversationId,
        senderId: senderId,
        message,
      });

      const conversation = await Conversation.findOne({ _id: conversationId });

      conversation.updatedAt = Date.now();
      await conversation.save();
      conversation.lastMessage = newMessage._id;
      await conversation.save();

      socket.emit("message-sent", {
        messageId: newMessage._id,
        status: "sent",
      });

      io.to(conversationId).emit("message-received", newMessage);
    })
  );

  //message read
  socket.on(
    "message-read",
    catchAsyncError(async (messageId) => {})
  );
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT: ${process.env.PORT}`);
});

export { io };
