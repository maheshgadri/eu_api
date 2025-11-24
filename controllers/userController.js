const User = require('../models/User');
const UserPhoto = require('../models/UserPhoto');

// exports.getUserById = async (req, res) => {
//   try {
//     const id = req.params.id;

//     // Fetch user and include photos
//     const user = await User.findByPk(id, {
//       include: [{
//         model: UserPhoto,
//         as: 'photos',
//         attributes: ['photo_url'] // only get photo URL
//       }]
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     return res.json(user); // returns user + photos
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"] // hide password
      },
      include: [{
        model: UserPhoto,
        as: "photos",
        attributes: ["photo_url"]
      }]
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// NEW: updateUserById
exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update(req.body);

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: err.message });
  }
};
