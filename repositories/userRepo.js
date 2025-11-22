const User = require("../models/User");

module.exports = {
    create: async (data) => {
        return await User.create(data);
    },

    findByEmail: async (email) => {
        return await User.findOne({ where: { email } });
    },

    findById: async (id) => {
        return await User.findByPk(id);
    }
};
