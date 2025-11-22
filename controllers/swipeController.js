const Like = require("../models/Like");
const Match = require("../models/Match");

module.exports.swipe = async (req, res) => {
    try {
        const sender = req.body.sender_id;
        const receiver = req.body.receiver_id;
        const status = req.body.status; // like / dislike

        await Like.likeUser(sender, receiver, status);

        // check for match
        if (status === "like") {
            const reverseLike = await Like.checkMutualLike(receiver, sender);

            if (reverseLike) {
                await Match.createMatch(sender, receiver);
                return res.json({ match: true });
            }
        }

        res.json({ match: false });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
