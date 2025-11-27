"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    const { email, password, fullname } = req.body;
    try {
        // Validate input
        if (!email || !password || !fullname) {
            return res.status(400).json({ success: false, message: "Email, password, and fullname are required" });
        }
        const existingUser = await db_1.default.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(400).json({ success: false, message: "User already exists" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await db_1.default.user.create({
            data: { email, password: hashedPassword, fullName: fullname },
        });
        res.status(201).json({
            success: true,
            message: "Registration successful!",
            user: { id: user.id, email: user.email, fullName: user.fullName }
        });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });
        res.json({
            success: true,
            message: "Login successful!",
            token
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.login = login;
