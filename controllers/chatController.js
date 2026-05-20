// const Conversation = require("../models/Conversation");
// const Message = require("../models/Message");
// const User = require("../models/User");

// // Start or get existing conversation
// exports.startConversation = async (req, res) => {
//   const { user1_id, user2_id } = req.body;

//   try {
//     // Check if conversation already exists
//     let convo = await Conversation.findOne({
//       where: { user1_id, user2_id }
//     });

//     if (!convo) {
//       convo = await Conversation.create({ user1_id, user2_id });
//     }

//     return res.json({ conversation_id: convo.id });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// // Get messages of a conversation
// exports.getMessages = async (req, res) => {
//   const { conversation_id } = req.params;

//   try {
//     const messages = await Message.findAll({
//       where: { conversation_id },
//       order: [["id", "ASC"]],
//     });

//     return res.json(messages);
//   } catch (error) {
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// // Send message
// exports.sendMessage = async (req, res) => {
//   const { conversation_id, sender_id, message } = req.body;

//   try {
//     const msg = await Message.create({
//       conversation_id,
//       sender_id,
//       message,
//     });

//     return res.json(msg);
//   } catch (error) {
//     return res.status(500).json({ error: "Server error" });
//   }
// };

const Block = require("../models/BlockedUser");
const { Op } = require("sequelize");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const admin = require("../config/firebase");


//18/5/2026
// Start or get existing conversation
// exports.startConversation = async (req, res) => {
//   const { user1_id, user2_id } = req.body;

//   try {
//     // Check both directions
//     let convo = await Conversation.findOne({
//       where: {
//         [Op.or]: [
//           { user1_id, user2_id },
//           { user1_id: user2_id, user2_id: user1_id }
//         ]
//       }
//     });

//     if (!convo) {
//      const msg = await Message.create({
//   conversation_id,
//   sender_id,
//   message,
// });
//     }

//     return res.json({ conversation_id: convo.id });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

exports.startConversation = async (req, res) => {
  const { user1_id, user2_id } = req.body;

  try {
    let convo = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1_id, user2_id },
          { user1_id: user2_id, user2_id: user1_id }
        ]
      }
    });

    if (!convo) {
      convo = await Conversation.create({
        user1_id,
        user2_id,
        status: "pending"
      });
    }

    // return res.json({ conversation_id: convo.id });
    return res.json({
  conversation_id: convo.id,
  status: convo.status,
    user2_id: convo.user2_id,
});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
// Get messages of a conversation
exports.getMessages = async (req, res) => {
  const { conversation_id } = req.params;

  try {
    const messages = await Message.findAll({
      where: { conversation_id },
      order: [["id", "ASC"]],
    });

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

// Send message
// exports.sendMessage = async (req, res) => {
//   const { conversation_id, sender_id, message } = req.body;

//   try {
//     const msg = await Message.create({
//       conversation_id,
//       sender_id,
//       message,
//     });

//     return res.json(msg);
//   } catch (error) {
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// exports.sendMessage = async (req, res) => {
//   const { conversation_id, sender_id, message } = req.body;

//   try {
//     // ✅ Save message
//     const msg = await Message.create({
//       conversation_id,
//       sender_id,
//       message,
//     });

//     // ✅ Get conversation
//     const convo = await Conversation.findByPk(conversation_id);

//     // ✅ Find receiver
//     const receiverId =
//       convo.user1_id === sender_id ? convo.user2_id : convo.user1_id;

//     // ✅ Get receiver + sender
//     const receiver = await User.findByPk(receiverId);
//     const sender = await User.findByPk(sender_id);

//     // ✅ SEND NOTIFICATION
//     if (receiver?.fcm_token) {
//       await admin.messaging().send({
//         token: receiver.fcm_token,
//         notification: {
//           title: sender.fullname,
//           body: message,
//         },
//         data: {
//           senderId: sender_id.toString(),
//           conversationId: conversation_id.toString(),
//         },
//       });

//       console.log("✅ Notification sent");
//     } else {
//       console.log("⚠️ No FCM token for user");
//     }

//     return res.json(msg);

//   } catch (error) {
//     console.error("SEND MESSAGE ERROR:", error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };
// exports.sendMessage = async (req, res) => {
//   const { conversation_id, sender_id, message } = req.body;

//   try {
//     // ✅ Get conversation
//     const convo = await Conversation.findByPk(conversation_id);

//     if (!convo) {
//       return res.status(404).json({ error: "Conversation not found" });
//     }

//     // ✅ Find receiver
//     const receiverId =
//       convo.user1_id === sender_id ? convo.user2_id : convo.user1_id;

//     // 🔥 BLOCK CHECK
//     const isBlocked = await Block.findOne({
//       where: {
//         [Op.or]: [
//           { blocker_id: sender_id, blocked_id: receiverId },
//           { blocker_id: receiverId, blocked_id: sender_id }
//         ]
//       }
//     });

//     if (isBlocked) {
//       return res.status(403).json({
//         error: "You cannot send message. User is blocked."
//       });
//     }

//     // ✅ Save message
//     const msg = await Message.create({
//       conversation_id,
//       sender_id,
//       message,
//     });

//     // ✅ Get users
//     const receiver = await User.findByPk(receiverId);
//     const sender = await User.findByPk(sender_id);

//     // ✅ SEND NOTIFICATION
//     if (receiver?.fcm_token) {
//       await admin.messaging().send({
//         token: receiver.fcm_token,
//         notification: {
//           title: sender.fullname,
//           body: message,
//         },
//         data: {
//           senderId: sender_id.toString(),
//           conversationId: conversation_id.toString(),
//         },
//       });

//       console.log("✅ Notification sent");
//     }

//     return res.json(msg);

//   } catch (error) {
//     console.error("SEND MESSAGE ERROR:", error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };


//18/5/2026

// exports.sendMessage = async (req, res) => {
//   const { conversation_id, sender_id, message } = req.body;

//   try {
//     if (!conversation_id || !sender_id || !message) {
//       return res.status(400).json({ error: "Missing data" });
//     }

//     const convo = await Conversation.findByPk(conversation_id);

//     if (!convo) {
//       return res.status(404).json({ error: "Conversation not found" });
//     }

//     const receiverId =
//       convo.user1_id === sender_id ? convo.user2_id : convo.user1_id;

//     // ✅ BLOCK CHECK (one-way)
//     const isBlocked = await Block.findOne({
//       where: {
//         blocker_id: receiverId,
//         blocked_id: sender_id
//       }
//     });

//     if (isBlocked) {
//       return res.status(403).json({
//         error: "You are blocked by this user"
//       });
//     }

//     const msg = await Message.create({
//       conversation_id,
//       sender_id,
//       message,
//     });

//     const receiver = await User.findByPk(receiverId);
//     const sender = await User.findByPk(sender_id);

//     if (receiver?.fcm_token) {
//       await admin.messaging().send({
//         token: receiver.fcm_token,
//         notification: {
//           title: sender.fullname,
//           body: message,
//         },
//         data: {
//           senderId: sender_id.toString(),
//           conversationId: conversation_id.toString(),
//         },
//       });
//     }

//     return res.json(msg);

//   } catch (error) {
//     console.error("SEND MESSAGE ERROR:", error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

exports.sendMessage = async (req, res) => {
  const { conversation_id, sender_id, message } = req.body;

  try {
    if (!conversation_id || !sender_id || !message) {
      return res.status(400).json({ error: "Missing data" });
    }

    const convo = await Conversation.findByPk(conversation_id);

    if (!convo) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const receiverId =
      convo.user1_id === sender_id ? convo.user2_id : convo.user1_id;

    // ✅ BLOCK CHECK
    const isBlocked = await Block.findOne({
      where: {
        blocker_id: receiverId,
        blocked_id: sender_id,
      },
    });

    if (isBlocked) {
      return res.status(403).json({
        error: "You are blocked by this user",
      });
    }

    // 🔥 NEW LOGIC STARTS HERE

    if (convo.status === "pending") {
      // Count messages
      const msgCount = await Message.count({
        where: { conversation_id },
      });

      // ❌ Allow ONLY first message
      if (msgCount >= 1) {
        return res.status(403).json({
          error: "Wait until user accepts your request",
        });
      }
    }

    // ✅ Save message
    const msg = await Message.create({
      conversation_id,
      sender_id,
      message,
    });

    const receiver = await User.findByPk(receiverId);
    const sender = await User.findByPk(sender_id);

    // ✅ Send notification
    if (receiver?.fcm_token) {
      await admin.messaging().send({
        token: receiver.fcm_token,
        notification: {
          title: sender.fullname,
          body: message,
        },
        data: {
          senderId: sender_id.toString(),
          conversationId: conversation_id.toString(),
        },
      });
    }

    return res.json({
      message: convo.status === "pending"
        ? "Message request sent"
        : "Message sent",
      data: msg,
    });

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.acceptRequest = async (req, res) => {
  const { conversation_id, user_id } = req.body;

  try {
    const convo = await Conversation.findByPk(conversation_id);

    if (!convo) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Only receiver can accept
    if (convo.user2_id !== user_id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    convo.status = "accepted";
    await convo.save();

    return res.json({ message: "Request accepted" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};