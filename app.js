const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/db");
const userRoutes = require('./routes/user');
const feedRouter = require("./routes/feed");
require("./models/User");
require("./models/UserPhoto");


const app = express();
app.use(cors());
app.use(express.json());

// Static for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", require("./routes/auth"));
app.use("/photos", require("./routes/photo"));
app.use("/swipe", require("./routes/swipe"));
app.use("/matches", require("./routes/match"));
app.use("/feed", require("./routes/feed"));
app.use('/api/users', userRoutes);
app.use("/api/feed", feedRouter);



sequelize.sync({ alter: true })
    .then(() => console.log("MySQL tables synced 👍"))
    .catch(err => console.log("DB Sync Error:", err));

app.listen(5001, () => console.log("API running on port 5001"));
