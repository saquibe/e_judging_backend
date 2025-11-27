import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);

    res.json({
        message: "Login successful",
        token,
        adminId: admin._id,
        name: admin.name, // Make sure this is included
        email: admin.email
    });
};
