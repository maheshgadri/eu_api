// const express = require("express");
// const router = express.Router();
// const {
//   startConversation,
//   getMessages,
//   sendMessage
// } = require("../controllers/chatController");

// router.post("/start", startConversation);     // Create/get conversation
// router.get("/:conversation_id", getMessages); // Fetch chat messages
// router.post("/send", sendMessage);            // Send message

// module.exports = router;


const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Start or get a conversation
router.post("/start", chatController.startConversation);

// Get messages of a conversation
router.get("/:conversation_id/messages", chatController.getMessages);

// Send message
router.post("/send", chatController.sendMessage);

module.exports = router;
