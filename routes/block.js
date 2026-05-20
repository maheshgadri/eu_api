const router = require("express").Router();
const blockController = require("../controllers/blockController");

router.post("/block", blockController.blockUser);
router.post("/unblock", blockController.unblockUser);

// route.js
router.get("/check", blockController.checkBlock);

module.exports = router;