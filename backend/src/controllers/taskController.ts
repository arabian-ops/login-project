import type { Request, Response } from "express";
import prisma from "../db.ts";

// Get all tasks for a user
export const getTasks = async (req: Request & { userId?: number }, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const tasks = await prisma.task.findMany({
      where: { userEmail: user.email },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, tasks });
  } catch (err: any) {
    console.error("Get tasks error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Create a task
export const createTask = async (req: Request & { userId?: number }, res: Response) => {
  const { title } = req.body;
  try {
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        userEmail: user.email,
        status: "active",
      },
    });

    res.status(201).json({ success: true, message: "Task created", task });
  } catch (err: any) {
    console.error("Create task error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Update task
export const updateTask = async (req: Request & { userId?: number }, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!task || task.userEmail !== user.email) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title },
    });

    res.json({ success: true, message: "Task updated", task: updatedTask });
  } catch (err: any) {
    console.error("Update task error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Toggle task completion
export const toggleTask = async (req: Request & { userId?: number }, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!task || task.userEmail !== user.email) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        status: task.status === "active" ? "completed" : "active",
        completedAt: task.status === "active" ? new Date() : null,
      },
    });

    res.json({ success: true, message: "Task toggled", task: updatedTask });
  } catch (err: any) {
    console.error("Toggle task error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Delete task
export const deleteTask = async (req: Request & { userId?: number }, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!task || task.userEmail !== user.email) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await prisma.task.delete({ where: { id: parseInt(id) } });

    res.json({ success: true, message: "Task deleted" });
  } catch (err: any) {
    console.error("Delete task error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
