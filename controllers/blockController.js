const Block = require("../models/BlockedUser");

exports.blockUser = async (req, res) => {
  const { blocker_id, blocked_id } = req.body;

  try {
    // prevent duplicate
    const exists = await Block.findOne({
      where: { blocker_id, blocked_id }
    });

    if (exists) {
      return res.json({ message: "Already blocked" });
    }

    await Block.create({ blocker_id, blocked_id });

    res.json({ message: "User blocked successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Block failed" });
  }
};


exports.unblockUser = async (req, res) => {
  const { blocker_id, blocked_id } = req.body;

  try {
    await Block.destroy({
      where: { blocker_id, blocked_id }
    });

    res.json({ message: "User unblocked" });

  } catch (err) {
    res.status(500).json({ error: "Unblock failed" });
  }
};


exports.checkBlock = async (req, res) => {
  const { user1, user2 } = req.query;

  try {
    const block = await Block.findOne({
      where: {
        [Op.or]: [
          { blocker_id: user1, blocked_id: user2 },
          { blocker_id: user2, blocked_id: user1 }
        ]
      }
    });

    res.json({ blocked: !!block });

  } catch (err) {
    res.status(500).json({ error: "Check failed" });
  }
};