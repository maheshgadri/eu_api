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


const { Op } = require("sequelize");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// Start or get existing conversation
exports.startConversation = async (req, res) => {
  const { user1_id, user2_id } = req.body;

  try {
    // Check both directions
    let convo = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1_id, user2_id },
          { user1_id: user2_id, user2_id: user1_id }
        ]
      }
    });

    if (!convo) {
      convo = await Conversation.create({ user1_id, user2_id });
    }

    return res.json({ conversation_id: convo.id });
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
exports.sendMessage = async (req, res) => {
  const { conversation_id, sender_id, message } = req.body;

  try {
    const msg = await Message.create({
      conversation_id,
      sender_id,
      message,
    });

    return res.json(msg);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
