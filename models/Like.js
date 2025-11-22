const db = require("../config/db");

module.exports = {
    likeUser: async (sender, receiver, status) => {
        const sql = `
            INSERT INTO likes (sender_id, receiver_id, status)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE status = VALUES(status)
        `;
        const [res] = await db.execute(sql, [sender, receiver, status]);
        return res;
    },

    checkMutualLike: async (sender, receiver) => {
        const sql = `
            SELECT * FROM likes
            WHERE sender_id = ? AND receiver_id = ? AND status = 'like'
        `;
        const [rows] = await db.execute(sql, [sender, receiver]);
        return rows.length > 0;
    }
};
