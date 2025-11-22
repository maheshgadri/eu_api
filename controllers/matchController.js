const Match = require("../models/Match");

module.exports.getMatches = async (req, res) => {
    try {
        const matches = await Match.getMatches(req.params.id);
        res.json({ matches });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
