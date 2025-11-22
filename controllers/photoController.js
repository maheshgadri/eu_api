// const UserPhoto = require("../models/UserPhoto");

// module.exports.uploadPhoto = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const fileUrl = `/uploads/${req.file.filename}`;

//         await UserPhoto.addPhoto(userId, fileUrl);

//         res.json({
//             message: "Photo uploaded",
//             url: fileUrl
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// module.exports.getPhotos = async (req, res) => {
//     try {
//         const photos = await UserPhoto.getPhotos(req.params.id);
//         res.json({ photos });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };


const photoModel = require("../models/photoModel");



module.exports.uploadPhotos = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No photos uploaded" });
        }

        let uploaded = [];

        for (const file of req.files) {
            const fileUrl = `/uploads/${file.filename}`;
            await photoModel.addPhoto(userId, fileUrl);
            uploaded.push(fileUrl);
        }

        res.json({
            message: "Photos uploaded successfully",
            photos: uploaded
        });

    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports.getPhotos = async (req, res) => {
    try {
        const photos = await photoModel.getPhotos(req.params.id);
        res.json({ photos });
    } catch (err) {
        console.error("Get Photo Error:", err);
        res.status(500).json({ error: err.message });
    }
};
