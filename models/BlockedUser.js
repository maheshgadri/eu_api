const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BlockedUser = sequelize.define("BlockedUser", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  blocker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  blocked_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }

}, {
  tableName: "blocked_users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

module.exports = BlockedUser;