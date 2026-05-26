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


const User = require("./models/User");
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/db");
const inboxRoutes = require("./routes/inbox");
const blockRoutes = require("./routes/block");
const Block = require("./models/BlockedUser");

// MODELS
require("./models/User");
require("./models/UserPhoto");
require("./models/Conversation");   // 🟢 ADD
require("./models/Message");        // 🟢 ADD
require("./models/BlockedUser"); 
// ROUTES
const userRoutes = require('./routes/user');
const feedRouter = require("./routes/feed");
const chatRoutes = require("./routes/chatRoutes"); // 🟢 ADD

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️ HIT SERVER:", req.method, req.url);
  next();
});

app.use("/api/block", blockRoutes);

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
/////26/5/2026
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Join chat room
//   socket.on("join_room", (conversation_id) => {
//     socket.join(conversation_id);
//     console.log(`User joined room: ${conversation_id}`);
//   });

//   // Receive + broadcast chat messages
// // socket.on("send_message", (data) => {
// //   const roomId = data.conversation_id || data.room; // support both

// //   console.log("📩 Socket message received:", data);

// //   io.to(roomId).emit("receive_message", data);
// // });

// // socket.on("send_message", async (data) => {
// //   try {
// //     const { sender_id, receiver_id, conversation_id } = data;

// //     // 🔥 CHECK IF BLOCK EXISTS
// //     const isBlocked = await Block.findOne({
// //       where: {
// //         [Op.or]: [
// //           { blocker_id: sender_id, blocked_id: receiver_id },
// //           { blocker_id: receiver_id, blocked_id: sender_id }
// //         ]
// //       }
// //     });

// //     if (isBlocked) {
// //       console.log("🚫 Message blocked due to user block");
// //       return; // ❌ STOP MESSAGE
// //     }

// //     const roomId = conversation_id || data.room;

// //     io.to(roomId).emit("receive_message", data);

// //   } catch (err) {
// //     console.error("SOCKET BLOCK ERROR:", err);
// //   }
// // });


// //18/5/2026
// // socket.on("send_message", async (data) => {
// //   const { sender_id, receiver_id, conversation_id } = data;

// //   // 🔥 SAME BLOCK LOGIC
// //   const isBlocked = await Block.findOne({
// //     where: {
// //       blocker_id: receiver_id,
// //       blocked_id: sender_id
// //     }
// //   });

// //   if (isBlocked) {
// //     console.log("🚫 Socket message blocked");
// //     return;
// //   }

// //   const roomId = conversation_id || data.room;

// //   io.to(roomId).emit("receive_message", data);
// // });

// const Conversation = require("./models/Conversation");
// const Message = require("./models/Message");

// socket.on("send_message", async (data) => {
//   try {
//     const { sender_id, receiver_id, conversation_id, message } = data;

//     // ✅ 1. Get conversation
//     const convo = await Conversation.findByPk(conversation_id);

//     if (!convo) {
//       console.log("❌ Conversation not found");
//       return;
//     }

//     // ✅ 2. Block check
//     const isBlocked = await Block.findOne({
//       where: {
//         blocker_id: receiver_id,
//         blocked_id: sender_id
//       }
//     });

//     if (isBlocked) {
//       console.log("🚫 Socket message blocked");
//       return;
//     }

//     // 🔥 3. PENDING CHECK (MOST IMPORTANT)
//     if (convo.status === "pending") {
//       const msgCount = await Message.count({
//         where: { conversation_id }
//       });

//       if (msgCount >= 1) {
//         console.log("🚫 Waiting for user to accept request");
//         return;
//       }
//     }

//     // ✅ 4. Broadcast message
//     io.to(conversation_id).emit("receive_message", data);

//   } catch (err) {
//     console.error("SOCKET ERROR:", err);
//   }
// });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });
//////26/5/2026

io.on("connection", async (socket) => {

  // ✅ GET USER ID FROM FLUTTER SOCKET
  const userId = socket.handshake.query.userId;

  console.log("🟢 User connected:", userId);

  // ================= ONLINE =================

  if (userId) {
    await User.update(
      {
        is_online: true,
      },
      {
        where: { id: userId },
      }
    );
  }

  // ================= JOIN ROOM =================

  socket.on("join_room", (conversation_id) => {
    socket.join(conversation_id);

    console.log(`User joined room: ${conversation_id}`);
  });

  // ================= SEND MESSAGE =================

  const Conversation = require("./models/Conversation");
  const Message = require("./models/Message");

  socket.on("send_message", async (data) => {

    try {

      const {
        sender_id,
        receiver_id,
        conversation_id,
        message,
      } = data;

      // ✅ GET CONVERSATION
      const convo = await Conversation.findByPk(conversation_id);

      if (!convo) {
        console.log("❌ Conversation not found");
        return;
      }

      // ✅ BLOCK CHECK
      const isBlocked = await Block.findOne({
        where: {
          blocker_id: receiver_id,
          blocked_id: sender_id,
        },
      });

      if (isBlocked) {
        console.log("🚫 Socket message blocked");
        return;
      }

      // ✅ PENDING REQUEST CHECK
      if (convo.status === "pending") {

        const msgCount = await Message.count({
          where: { conversation_id },
        });

        if (msgCount >= 1) {
          console.log("🚫 Waiting for user accept");
          return;
        }
      }

      // ✅ SEND MESSAGE
      io.to(conversation_id).emit(
        "receive_message",
        data
      );

    } catch (err) {
      console.error("SOCKET ERROR:", err);
    }
  });

  // ================= DISCONNECT =================

  socket.on("disconnect", async () => {

    console.log("🔴 User disconnected:", userId);

    if (userId) {

      await User.update(
        {
          is_online: false,
          last_seen: new Date(),
        },
        {
          where: { id: userId },
        }
      );
    }
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
// sequelize.sync({ alter: true })
sequelize.sync()
  .then(() => console.log("MySQL tables synced 👍"))
  .catch(err => console.log("DB Sync Error:", err));

// ----------------------
// START SERVER 🟢
// ----------------------
server.listen(5001, () => {
  console.log("API running with Socket.io on port 5001");
});
