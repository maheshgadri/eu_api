const UserPhoto = require("./UserPhoto");

module.exports = {
    addPhoto: async (user_id, url) => {
        return await UserPhoto.create({ user_id, photo_url: url });
    },

    getPhotos: async (user_id) => {
        return await UserPhoto.findAll({ where: { user_id } });
    }
};
