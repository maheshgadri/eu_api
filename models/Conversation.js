// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

// const Conversation = sequelize.define("Conversation", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   user1_id: { type: DataTypes.INTEGER, allowNull: false },
//   user2_id: { type: DataTypes.INTEGER, allowNull: false },
// }, {
//   timestamps: true,
//   createdAt: "created_at",
//   updatedAt: false,
// });

// module.exports = Conversation;


// model/Conversation.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user1_id: { type: DataTypes.INTEGER, allowNull: false },
    user2_id: { type: DataTypes.INTEGER, allowNull: false },

    // ✅ ADD THIS
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Conversation;