const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
    try {
        const { fullname, email, phone, gender, dob, password } = req.body;

        if (!fullname || !email || !phone || !gender || !dob || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const hashed = await bcrypt.hash(password, 10);

        // Create user in DB
        const user = await User.create({
            fullname,
            email,
            phone,
            gender,
            dob,
            password: hashed
        });

        return res.status(201).json({
            message: "User registered",
            userId: user.id   // <-- FIXED
        });

    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({ error: err.message || "Server error" });
    }
};

module.exports.login = async (req, res) => {
    try {
        console.log("🔥 LOGIN HIT BODY:", req.body);

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        console.log("DB USER:", user);

        if (!user) {
            console.log("❌ USER NOT FOUND");
            return res.status(404).json({ error: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);

        console.log("PASSWORD MATCH:", match);

        if (!match) {
            console.log("❌ INVALID PASSWORD");
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ id: user.id }, "SECRETKEY");

        console.log("✅ LOGIN SUCCESS");

        return res.json({
            message: "Login success",
            token,
            userId: user.id
        });

    } catch (err) {
        console.error("🔥 LOGIN ERROR:", err);
        return res.status(500).json({
            error: err.message,
            stack: err.stack
        });
    }
};
// module.exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//  console.log("🔥 LOGIN HIT BODY:", req.body);
//         // Find user using Sequelize
//         const user = await User.findOne({ where: { email } });
//         if (!user) return res.status(404).json({ error: "User not found" });

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) return res.status(400).json({ error: "Invalid password" });

//         const token = jwt.sign({ id: user.id }, "SECRETKEY");

//         res.json({
//             message: "Login success",
//             token,
//             userId: user.id
//         });
//     } catch (err) {
//         console.error("LOGIN ERROR:", err);
//         res.status(500).json({ error: err.message });
//     }
// };