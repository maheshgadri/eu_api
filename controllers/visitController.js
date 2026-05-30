// const ProfileVisit = require("../models/ProfileVisit");
// const User = require("../models/User");
// const UserPhoto = require("../models/UserPhoto");

const { ProfileVisit, User, UserPhoto } =
    require("../models");

// exports.addVisit = async (req, res) => {
//   try {
//     const { profile_user_id, visitor_id } = req.body;

//     if (profile_user_id == visitor_id) {
//       return res.json({ success: true });
//     }

//     await ProfileVisit.create({
//       profile_user_id,
//       visitor_id,
//     });

//     res.json({
//       success: true,
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };
exports.addVisit = async (req, res) => {
  try {
    console.log("📦 Incoming Visit Payload:", req.body); // 👈 ADD THIS
    
    const { profile_user_id, visitor_id } = req.body;
    
    if (profile_user_id == visitor_id) {
      console.log("⚠️ Self-visit detected on backend router");
      return res.json({ success: true });
    }
    
    const newVisit = await ProfileVisit.create({ profile_user_id, visitor_id });
    console.log("💾 Database Row Created successfully:", newVisit.toJSON()); // 👈 ADD THIS
    
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Controller Error:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.getMyVisitors = async (req, res) => {
  try {

    const userId = req.params.userId;

    const visits = await ProfileVisit.findAll({
      where: {
        profile_user_id: userId,
      },

      include: [
        {
          model: User,
          as: "visitor",

          attributes: [
            "id",
            "fullname",
            "dob",
            "country",
          ],

          include: [
            {
              model: UserPhoto,
              as: "photos",
              attributes: ["photo_url"],
            },
          ],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.json(visits);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
};




exports.getVisitCount = async (req, res) => {
  try {
    const userId = req.params.userId;

    const count = await ProfileVisit.count({
      where: {
        profile_user_id: userId,
      },
    });

    res.json({
      count,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
};


exports.getUnreadVisitCount = async (req, res) => {
  try {
    const userId = req.params.userId;

    const count = await ProfileVisit.count({
      where: {
        profile_user_id: userId,
        is_seen: false,
      },
    });

    res.json({
      count,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


exports.markVisitsSeen = async (req, res) => {
  try {

    const userId = req.params.userId;

    await ProfileVisit.update(
      {
        is_seen: true,
      },
      {
        where: {
          profile_user_id: userId,
          is_seen: false,
        },
      }
    );

    res.json({
      success: true,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};