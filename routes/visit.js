const router = require("express").Router();

const {
  addVisit,
  getMyVisitors,
  getVisitCount,
} = require("../controllers/visitController");

router.post("/add", addVisit);

router.get("/:userId", getMyVisitors);

module.exports = router;