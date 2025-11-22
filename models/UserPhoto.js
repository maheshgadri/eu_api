// const db = require("../config/db");

// module.exports = {
//     addPhoto: async (user_id, url) => {
//         const sql = `INSERT INTO user_photos (user_id, photo_url) VALUES (?, ?)`;
//         const [res] = await db.execute(sql, [user_id, url]);
//         return res;
//     },

//     getPhotos: async (user_id) => {
//         const [rows] = await db.execute(`SELECT * FROM user_photos WHERE user_id = ?`, [user_id]);
//         return rows;
//     }
// };


// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

// const UserPhoto = sequelize.define("user_photos", {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     user_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     photo_url: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     timestamps: true
// });

// module.exports = UserPhoto;


// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");
// const User = require("./User");   // ⬅ IMPORTANT

// const UserPhoto = sequelize.define("user_photos", {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     user_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     photo_url: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     timestamps: true
// });

// // 🔥 Add Associations
// User.hasMany(UserPhoto, { foreignKey: "user_id" });
// UserPhoto.belongsTo(User, { foreignKey: "user_id" });

// module.exports = UserPhoto;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserPhoto = sequelize.define("UserPhoto", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  photo_url: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "user_photos",
  timestamps: true
});

module.exports = UserPhoto;
