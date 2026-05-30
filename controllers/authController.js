const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const geoip = require("geoip-lite");


const countries = require("i18n-iso-countries");

countries.registerLocale(
  require("i18n-iso-countries/langs/en.json")
);

const admin = require("../config/firebase");


module.exports.saveFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({ error: "Missing data" });
    }

    await User.update(
      { fcm_token: fcmToken },
      { where: { id: userId } }
    );

    return res.json({ message: "FCM token saved" });

  } catch (err) {
    console.error("SAVE TOKEN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.firebaseLogin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // ✅ Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    const { uid, email, phone_number, name, picture } = decoded;

    console.log("🔥 FIREBASE USER:", decoded);

      // ✅ Detect country from IP
    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

    console.log("🌍 USER IP:", ip);

    const geo = geoip.lookup(ip);

    console.log("🌍 GEO:", geo);

    const country =
      countries.getName(geo?.country, "en") || "India";

    console.log("🌍 COUNTRY:", country);

    // 🔍 Check if user exists
    let user = null;

    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (phone_number) {
      user = await User.findOne({ where: { phone: phone_number } });
    }

    // 🆕 Create user if not exists
    if (!user) {
      user = await User.create({
        fullname: name || "User",
        email: email || null,
        phone: phone_number || null,
        password: "firebase", // dummy
        gender: "Other",
        dob: "2000-01-01",
        is_verified: true,
        country: country,
      });
    }

    // return res.json({
    //   message: "Login success",
    //   token,
    //   userId: user.id,
    //   firebaseUid: uid
    // });

    return res.json({
  message: "Login success",
  token,
  userId: user.id,
  firebaseUid: uid,

  fullname: user.fullname,
  email: user.email,
  phone: user.phone,
  gender: user.gender,
  dob: user.dob,
  about: user.about,
  country: user.country,

  profile_completed: user.profile_completed,
});

  } catch (err) {
    console.error("🔥 FIREBASE LOGIN ERROR:", err);
    return res.status(401).json({ error: "Invalid Firebase token" });
  }
};

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