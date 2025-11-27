// models/Admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String }, // Add name field
    email: { type: String, required: true },
    password: { type: String, required: true }
});

export default mongoose.model("Admin", adminSchema);