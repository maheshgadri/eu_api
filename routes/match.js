const router = require("express").Router();
const match = require("../controllers/matchController");

router.get("/:id", match.getMatches);

module.exports = router;
