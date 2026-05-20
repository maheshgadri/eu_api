const router = require("express").Router();
const auth = require("../controllers/authController");

router.post("/signup", auth.signup);
router.post("/login", auth.login);


router.post("/firebase-login", auth.firebaseLogin);
router.post("/save-token", auth.saveFcmToken);

module.exports = router;
