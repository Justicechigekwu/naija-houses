import Admin from "../models/adminModel.js";
import generateToken from "../utils/generateTokenUtils.js";

export const adminRegister = async (req, res) => {
  try {
    const { email, password, setupKey } = req.body;

    if (!email || !password || !setupKey) {
      return res.status(400).json({ message: "email, password, setupKey required" });
    }

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: "Invalid setup key" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ email, password });
    const token = generateToken(admin._id, { isAdmin: true });

    res.status(201).json({
      message: "Admin created",
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to register admin" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email or password" });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(admin._id, { isAdmin: true });

    res.json({
      message: "Admin login successful",
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Admin login failed" });
  }
};