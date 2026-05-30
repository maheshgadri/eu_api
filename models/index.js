const User = require("./User");
const UserPhoto = require("./UserPhoto");
const ProfileVisit = require("./ProfileVisit");

// ✅ ONLY THIS ASSOCIATION
ProfileVisit.belongsTo(User, {
  foreignKey: "visitor_id",
  as: "visitor",
});

module.exports = {
  User,
  UserPhoto,
  ProfileVisit,
};