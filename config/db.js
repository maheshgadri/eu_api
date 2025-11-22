// const mysql = require("mysql2/promise");

// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",         // your MySQL username
//     password: "",         // your MySQL password
//     database: "eu_db",  // your database name
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// db.getConnection()
//     .then(() => console.log("✅ MySQL connected"))
//     .catch((err) => console.error("❌ MySQL connection error:", err));

// module.exports = db;


const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("eu_db", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

module.exports = sequelize;
