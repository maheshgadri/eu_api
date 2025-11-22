const db = require("../config/db");

module.exports = {
    createMatch: async (u1, u2) => {
        const sql = `
            INSERT IGNORE INTO matches (user1_id, user2_id)
            VALUES (?, ?)
        `;
        const [res] = await db.execute(sql, [u1, u2]);
        return res;
    },

    getMatches: async (user_id) => {
        const sql = `
            SELECT * FROM matches 
            WHERE user1_id = ? OR user2_id = ?
        `;
        const [rows] = await db.execute(sql, [user_id, user_id]);
        return rows;
    }
};
