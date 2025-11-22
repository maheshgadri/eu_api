const router = require("express").Router();
const swipe = require("../controllers/swipeController");

router.post("/", swipe.swipe);

module.exports = router;
