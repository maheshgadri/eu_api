// const db = require("../config/db");

// module.exports = {
//     create: async (data) => {
//         const sql = `INSERT INTO users (fullname, email, phone, password, gender, dob)
//                      VALUES (?, ?, ?, ?, ?, ?)`;
//         const [res] = await db.execute(sql, [
//             data.fullname,
//             data.email,
//             data.phone,
//             data.password,
//             data.gender,
//             data.dob
//         ]);
//         return res;
//     },

//     findByEmail: async (email) => {
//         const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
//         return rows[0];
//     },

//     findById: async (id) => {
//         const [rows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);
//         return rows[0];
//     }
// };



// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");


// const User = sequelize.define("User", {
//     fullname: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false
//     },
//     phone: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     gender: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     dob: {
//         type: DataTypes.DATEONLY,
//         allowNull: false
//     }
// }, {
//     tableName: "users"
// });



// module.exports = User;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const UserPhoto = require("./UserPhoto"); // only import, don't require User itself

const User = sequelize.define("User", {
  fullname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  dob: { type: DataTypes.DATEONLY, allowNull: false },
  about: { type: DataTypes.TEXT, allowNull: true },
 hobbies: { type: DataTypes.TEXT, allowNull: true },
 job_title: { type: DataTypes.STRING, allowNull: true },

education: { type: DataTypes.STRING, allowNull: true },
weight: { type: DataTypes.INTEGER, allowNull: true },
height: { type: DataTypes.INTEGER, allowNull: true },
interests: { type: DataTypes.TEXT, allowNull: true },
relationship_goal: { type: DataTypes.STRING, allowNull: true },
smoking: { type: DataTypes.STRING, allowNull: true },
drinking: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: "users"
});

// Associations (define here only)
User.hasMany(UserPhoto, { foreignKey: "user_id", as: "photos" });
UserPhoto.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = User;
