
import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      isAdmin: true,
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const adminRegister = async (req, res) => {
  try {
    const { email, password, setupKey } = req.body;

    if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: "Invalid setup key" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ email, password });
    const token = signAdminToken(admin);

    res.status(201).json({
      admin: {
        id: admin._id,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Admin registration failed" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = signAdminToken(admin);

    res.json({
      admin: {
        id: admin._id,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Admin login failed" });
  }
};

export const getAdminMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("_id email createdAt");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({
      id: admin._id,
      email: admin.email,
      createdAt: admin.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load admin profile" });
  }
};