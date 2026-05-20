const express = require("express");
const router = express.Router();

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const UserPhoto = require("../models/UserPhoto");
const { Op } = require("sequelize");

// router.get("/:userId", async (req, res) => {
//   const userId = Number(req.params.userId);

//   try {
//     const conversations = await Conversation.findAll({
//       where: {
//         [Op.or]: [
//           { user1_id: userId },
//           { user2_id: userId }
//         ]
//       }
//     });

//     let inboxData = [];

//     for (const convo of conversations) {

//       // 🔥 Correct friend detection
//       let friendId = null;

//       if (convo.user1_id == userId) {
//         friendId = convo.user2_id;
//       } else if (convo.user2_id == userId) {
//         friendId = convo.user1_id;
//       }

//       if (!friendId || friendId == userId) continue;

//       // Get friend details
//       const friend = await User.findByPk(friendId, {
//         include: [
//           { model: UserPhoto, as: "photos", limit: 1 }
//         ]
//       });

//       if (!friend) continue;

//       // 🔥 Last message sent by FRIEND only
//       const lastMessage = await Message.findOne({
//         where: {
//           conversation_id: convo.id,
//           sender_id: friendId  
//         },
//         order: [["created_at", "DESC"]]
//       });

//       if (!lastMessage) continue;

//       const hoursAgo = Math.floor((Date.now() - new Date(lastMessage.created_at)) / 3600_000);

//       inboxData.push({
//         conversation_id: convo.id,
//         user_id: friend.id,
//         fullname: friend.fullname,
//         profile_pic: friend.photos[0]?.photo_url || null,
//         last_message: lastMessage.message,
//         time_ago: hoursAgo + " hr"
//       });
//     }

//     // 🔥 Sort by latest message first
//     inboxData.sort((a, b) => b.conversation_id - a.conversation_id);

//     res.json(inboxData);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to load inbox" });
//   }
// });


router.get("/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      }
    });

    let inbox = [];

    for (const convo of conversations) {

      // Identify friend
      let friendId =
        convo.user1_id == userId ? convo.user2_id :
        convo.user2_id == userId ? convo.user1_id :
        null;

      if (!friendId || friendId == userId) continue;

      // Load friend profile
      const friend = await User.findByPk(friendId, {
        include: [
          { model: UserPhoto, as: "photos" }
        ]
      });

      if (!friend) continue;

      // Get LAST MESSAGE sent by friend only
      // const lastMsg = await Message.findOne({
      //   where: {
      //     conversation_id: convo.id,
      //     sender_id: friendId
      //   },
      //   order: [["created_at", "DESC"]]
      // });

      const lastMsg = await Message.findOne({
  where: {
    conversation_id: convo.id
  },
  order: [["created_at", "DESC"]]
});

      if (!lastMsg) continue;

      // Time in hours
      const hoursAgo = Math.floor(
        (Date.now() - new Date(lastMsg.created_at)) / 3600000
      );

    //   inbox.push({
    //     user: {
    //       id: friend.id,
    //       fullname: friend.fullname,
    //       photos: friend.photos.map(p => ({
    //         photoUrl: p.photo_url
    //       }))
    //     },
    //     lastMessage: lastMsg.message,
    //     time: hoursAgo + " hr",
    //     timeRaw: lastMsg.created_at 

    //   });
    // }
    
          inbox.push({
        // user: {
        //   id: friend.id,
        //   fullname: friend.fullname,
        //   photos: friend.photos.map(p => ({
        //     photoUrl: p.photo_url
        //   }))
        // },
        user: {
  id: friend.id || 0,
  fullname: friend.fullname || "",
  email: friend.email || "",       // ✅ REQUIRED
  gender: friend.gender || "",     // ✅ REQUIRED
  dob: friend.dob || "",           // ✅ REQUIRED
  photos: (friend.photos || []).map(p => ({
    photoUrl: p.photo_url || ""
  }))
},
        lastMessage: lastMsg.message,
        time: hoursAgo + " hr",
        timeRaw: lastMsg.created_at   // ✅ ADD THIS
      });
    }

    // 🔥 ADD THIS BLOCK HERE
    inbox.sort((a, b) => {
      return new Date(b.timeRaw) - new Date(a.timeRaw);
    });

    res.json(inbox);

    // res.json(inbox);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Inbox loading failed" });
  }
});



module.exports = router;
