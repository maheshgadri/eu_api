const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProfileVisit = sequelize.define(
  "ProfileVisit",
  {
    profile_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    visitor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    
    is_seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },


  },
  {
    tableName: "profile_visits",
  }
);

module.exports = ProfileVisit;