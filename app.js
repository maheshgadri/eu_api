// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const sequelize = require("./config/db");
// const userRoutes = require('./routes/user');
// const feedRouter = require("./routes/feed");
// require("./models/User");
// require("./models/UserPhoto");


// const app = express();
// app.use(cors());
// app.use(express.json());

// // Static for uploaded images
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/auth", require("./routes/auth"));
// app.use("/photos", require("./routes/photo"));
// app.use("/swipe", require("./routes/swipe"));
// app.use("/matches", require("./routes/match"));
// app.use("/feed", require("./routes/feed"));
// app.use('/api/users', userRoutes);
// app.use("/api/feed", feedRouter);



// sequelize.sync({ alter: true })
//     .then(() => console.log("MySQL tables synced 👍"))
//     .catch(err => console.log("DB Sync Error:", err));

// app.listen(5001, () => console.log("API running on port 5001"));



const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/db");
const inboxRoutes = require("./routes/inbox");

// MODELS
require("./models/User");
require("./models/UserPhoto");
require("./models/Conversation");   // 🟢 ADD
require("./models/Message");        // 🟢 ADD

// ROUTES
const userRoutes = require('./routes/user');
const feedRouter = require("./routes/feed");
const chatRoutes = require("./routes/chatRoutes"); // 🟢 ADD

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server for Socket.io
const server = http.createServer(app);

// ----------------------
// SOCKET.IO SETUP 🟢
// ----------------------
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join chat room
  socket.on("join_room", (conversation_id) => {
    socket.join(conversation_id);
    console.log(`User joined room: ${conversation_id}`);
  });

  // Receive + broadcast chat messages
socket.on("send_message", (data) => {
  const roomId = data.conversation_id || data.room; // support both

  console.log("📩 Socket message received:", data);

  io.to(roomId).emit("receive_message", data);
});

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Make io available in routes if needed
app.set("io", io);

// ----------------------
// STATIC FILES
// ----------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------------
// EXISTING ROUTES
// ----------------------
app.use("/auth", require("./routes/auth"));
app.use("/photos", require("./routes/photo"));
app.use("/swipe", require("./routes/swipe"));
app.use("/matches", require("./routes/match"));
app.use("/feed", require("./routes/feed"));
app.use("/api/users", userRoutes);
app.use("/api/feed", feedRouter);

// ----------------------
// CHAT ROUTES 🟢
// ----------------------
app.use("/api/chat", chatRoutes);


//-----
// Inbox

app.use("/api/inbox", inboxRoutes);


// ----------------------
// SYNC DATABASE
// ----------------------
sequelize.sync({ alter: true })
  .then(() => console.log("MySQL tables synced 👍"))
  .catch(err => console.log("DB Sync Error:", err));

// ----------------------
// START SERVER 🟢
// ----------------------
server.listen(5001, () => {
  console.log("API running with Socket.io on port 5001");
});
