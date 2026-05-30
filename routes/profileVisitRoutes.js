const router = require("express").Router();

const {
  addVisit,
  getMyVisitors,
  getVisitCount,
  getUnreadVisitCount,
  markVisitsSeen,
} = require("../controllers/visitController");

router.post("/add", addVisit);

router.get("/count/:userId", getVisitCount);

// Unread visits count
router.get("/unread-count/:userId", getUnreadVisitCount);

// Mark all visits as seen
router.put("/mark-seen/:userId", markVisitsSeen);


router.get("/:userId", getMyVisitors);

module.exports = router;