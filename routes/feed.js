// const router = require("express").Router();
// const User = require("../models/User");
// const UserPhoto = require("../models/UserPhoto");
// const { Op } = require("sequelize");

// // Get all users + photos
// router.get("/:id", async (req, res) => {
//   try {
//     const loggedUserId = req.params.id;

//     const users = await User.findAll({
//       where: { id: { [Op.ne]: loggedUserId } },
//       attributes: ["id", "fullname", "email", "gender", "dob"],
//       include: [
//         {
//           model: UserPhoto,
//           as: "photos", // ✅ Use the alias here
//           attributes: ["photo_url"],
//           limit: 3
//         }
//       ]
//     });

//     res.json({ users });

//   } catch (err) {
//     console.error("Feed Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const Block = require("../models/BlockedUser");
const router = require("express").Router();
const User = require("../models/User");
const UserPhoto = require("../models/UserPhoto");
const { Op } = require("sequelize");





router.get("/filter", async (req, res) => {
  try {
    const { minAge, maxAge, lookingFor, excludeUserId } = req.query;

    const loggedUserId = Number(excludeUserId || 0);

    // 🔥 BLOCK LIST
    const blocked = await Block.findAll({
      where: {
        [Op.or]: [
          { blocker_id: loggedUserId },
          { blocked_id: loggedUserId }
        ]
      }
    });

    const blockedIds = blocked.map(b =>
      b.blocker_id === loggedUserId ? b.blocked_id : b.blocker_id
    );

    // DOB calculation
    const today = new Date();
    const maxDob = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    const minDob = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());

    const users = await User.findAll({
      where: {
        id: {
          [Op.ne]: loggedUserId,
          [Op.notIn]: blockedIds   // ✅ ADD THIS
        },
        gender: lookingFor ? lookingFor : { [Op.ne]: null },
        dob: {
          [Op.between]: [
            minDob.toISOString().split("T")[0],
            maxDob.toISOString().split("T")[0]
          ]
        }
      },
      attributes: ["id", "fullname", "email", "gender", "dob"],
      include: [
        {
          model: UserPhoto,
          as: "photos",
          attributes: ["id", "photo_url"],
          limit: 3
        }
      ]
    });

    res.json({ users });

  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ error: err.message });
  }
});
// -------------------- Filtered Feed --------------------
// router.get("/filter", async (req, res) => {
//   try {
//     const { minAge, maxAge, lookingFor, excludeUserId } = req.query;

//     // Calculate DOB range from age
//     const today = new Date();
//     const maxDob = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
//     const minDob = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());

//     const users = await User.findAll({
//       where: {
//         id: { [Op.ne]: excludeUserId || 0 },
//         gender: lookingFor ? lookingFor : { [Op.ne]: null },
//         dob: {
//           [Op.between]: [minDob.toISOString().split("T")[0], maxDob.toISOString().split("T")[0]]
//         }
//       },
//       attributes: ["id", "fullname", "email", "gender", "dob"],
//       include: [
//         {
//           model: UserPhoto,
//           as: "photos",
//           // attributes: ["photo_url"],
//           attributes: ["id", "photo_url"],
//           limit: 3
//         }
//       ]
//     });

//     res.json({ users });

//   } catch (err) {
//     console.error("Filter Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// -------------------- Normal Feed --------------------
// router.get("/:id", async (req, res) => {
//   try {
//     const loggedUserId = req.params.id;

//     const users = await User.findAll({
//       where: { id: { [Op.ne]: loggedUserId } },
//       attributes: ["id", "fullname", "email", "gender", "dob"],
//       include: [
//         {
//           model: UserPhoto,
//           as: "photos", // important: alias must match model association
//           // attributes: ["photo_url"],
//           attributes: ["id", "photo_url"],
//           limit: 3
//         }
//       ]
//     });

//     res.json({ users });

//   } catch (err) {
//     console.error("Feed Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/:id", async (req, res) => {
  try {
    const loggedUserId = Number(req.params.id);

    // 🔥 GET BLOCKED USERS
    const blocked = await Block.findAll({
      where: {
        [Op.or]: [
          { blocker_id: loggedUserId },
          { blocked_id: loggedUserId }
        ]
      }
    });

    // 🔥 EXTRACT BLOCKED IDs
    const blockedIds = blocked.map(b =>
      b.blocker_id === loggedUserId ? b.blocked_id : b.blocker_id
    );

    // 🔥 FETCH USERS EXCLUDING BLOCKED
    const users = await User.findAll({
      where: {
        id: {
          [Op.ne]: loggedUserId,
          [Op.notIn]: blockedIds   // ✅ IMPORTANT
        }
      },
      attributes: ["id", "fullname", "email", "gender", "dob"],
      include: [
        {
          model: UserPhoto,
          as: "photos",
          attributes: ["id", "photo_url"],
          limit: 3
        }
      ]
    });

    res.json({ users });

  } catch (err) {
    console.error("Feed Error:", err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
