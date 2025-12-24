// adminController.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log(`Admin not found: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log(`Admin found: ${admin.email}`);
    console.log(`Password in DB: ${admin.password}`);

    // SIMPLE PLAIN TEXT COMPARISON - No hashing
    const isPasswordValid = admin.password === password;

    console.log(`Password comparison result: ${isPasswordValid}`);
    console.log(`Input password: ${password}`);
    console.log(`DB password: ${admin.password}`);

    if (!isPasswordValid) {
      console.log(`Invalid password for: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role || "judge",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log(`✅ Login successful for: ${email}`);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role || "judge",
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      success: false,
      message: "Server error during login: " + err.message,
    });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      data: admin,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
