const User = require('../models/User');
const UserPhoto = require('../models/UserPhoto');

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch user and include photos
    const user = await User.findByPk(id, {
      include: [{
        model: UserPhoto,
        as: 'photos',
        attributes: ['photo_url'] // only get photo URL
      }]
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user); // returns user + photos
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
