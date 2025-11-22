// const router = require("express").Router();
// const multer = require("multer");
// const photo = require("../controllers/photoController");

// const storage = multer.diskStorage({
//     destination: "uploads/",
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "_" + file.originalname);
//     }
// });

// const upload = multer({ storage });

// router.post("/upload/:id", upload.single("photo"), photo.uploadPhoto);
// router.get("/:id", photo.getPhotos);

// module.exports = router;

const express = require("express");
const multer = require("multer");
const path = require("path");
const photoController = require("../controllers/photoController");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + "_" + file.originalname)
});

const upload = multer({ storage });

// OLD ❌ only single photo
// router.post("/upload/:id", upload.single("photo"), photoController.uploadPhoto);

// NEW ✅ allow multiple photos
router.post("/upload/:id", upload.array("photos", 3), photoController.uploadPhotos);

router.get("/:id", photoController.getPhotos);

module.exports = router;

