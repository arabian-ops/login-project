import type { Request, Response } from "express";
import prisma from "../db.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { email, password, fullname } = req.body;
  try {
    // Validate input
    if (!email || !password || !fullname) {
      return res.status(400).json({ success: false, message: "Email, password, and fullname are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, fullName: fullname },
    });

    res.status(201).json({ 
      success: true, 
      message: "Registration successful!", 
      user: { id: user.id, email: user.email, fullName: user.fullName } 
    });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    res.json({ 
      success: true, 
      message: "Login successful!", 
      token 
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
