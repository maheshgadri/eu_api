// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

// const Message = sequelize.define("Message", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   conversation_id: { type: DataTypes.INTEGER, allowNull: false },
//   sender_id: { type: DataTypes.INTEGER, allowNull: false },
//   message: { type: DataTypes.TEXT, allowNull: false },
// }, {
//   timestamps: true,
//   createdAt: "created_at",
//   updatedAt: false,
// });

// module.exports = Message;

// models/Message.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Conversations",
        key: "id",
      },
    },

    sender_id: { type: DataTypes.INTEGER, allowNull: false },

    message: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,

    indexes: [
      {
        fields: ["conversation_id"],
      },
    ],
  }
);

module.exports = Message;
