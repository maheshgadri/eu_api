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

const { execFile } = require("child_process");
const User = require("../models/User");
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


module.exports.deletePhoto = async (req, res) => {
    try {
        const photoId = req.params.photoId;

        const deleted = await photoModel.deletePhoto(photoId);

        if (!deleted) {
            return res.status(404).json({
                error: "Photo not found"
            });
        }

        res.json({
            message: "Photo deleted successfully"
        });

    } catch (err) {
        console.error("Delete Photo Error:", err);

        res.status(500).json({
            error: err.message
        });
    }
};


// module.exports.verifySelfie = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     if (!req.file) {
//       return res.status(400).json({ error: "Selfie required" });
//     }

//     const selfiePath = req.file.path;

//     // Get user first photo
//     const photos = await photoModel.getPhotos(userId);
//     if (!photos.length) {
//       return res.status(400).json({ error: "No profile photo found" });
//     }

//     const storedPath = "." + photos[0].photo_url;

//   execFile(
//   "./venv/bin/python",
//   ["verify_face.py", storedPath, selfiePath],
//       async (err, stdout) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: "Python error" });
//         }

//         const result = stdout.trim();

//         if (result.startsWith === "MATCH") {
//           await User.update(
//             { is_verified: true },
//             { where: { id: userId } }
//           );

//           return res.json({ verified: true });
//         }

//         res.json({ verified: false });
//       }
//     );

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

module.exports.verifySelfie = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "Selfie required" });
    }

    const selfiePath = req.file.path;

    // Get user photos
    const photos = await photoModel.getPhotos(userId);

    if (!photos.length) {
      return res.status(400).json({
        error: "No profile photo found"
      });
    }

    const storedPath = "." + photos[0].photo_url;

    // ✅ DEBUG LOGS
    console.log("Stored Image:", storedPath);
    console.log("Selfie Image:", selfiePath);

   execFile(
  "/Users/maheshgadri/eu_api/venv/bin/python",
  ["verify_face.py", storedPath, selfiePath],

      async (err, stdout) => {

        if (err) {
          console.error("PYTHON ERROR:", err);

          return res.status(500).json({
            error: "Python error"
          });
        }

        const result = stdout.trim();

        // ✅ DEBUG RESULT
        console.log("PYTHON RESULT:", result);

        // ✅ FIXED
        if (result.includes("MATCH")) {

          await User.update(
            { is_verified: true },
            { where: { id: userId } }
          );

          return res.json({
            verified: true
          });
        }

        return res.json({
          verified: false
        });
      }
    );

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
};