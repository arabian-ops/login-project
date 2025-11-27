"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.toggleTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const db_1 = __importDefault(require("../db"));
// Get all tasks for a user
const getTasks = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const tasks = await db_1.default.task.findMany({
            where: { userEmail: user.email },
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, tasks });
    }
    catch (err) {
        console.error("Get tasks error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.getTasks = getTasks;
// Create a task
const createTask = async (req, res) => {
    const { title } = req.body;
    try {
        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const task = await db_1.default.task.create({
            data: {
                title,
                userEmail: user.email,
                status: "active",
            },
        });
        res.status(201).json({ success: true, message: "Task created", task });
    }
    catch (err) {
        console.error("Create task error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.createTask = createTask;
// Update task
const updateTask = async (req, res) => {
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
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const task = await db_1.default.task.findUnique({ where: { id: parseInt(id) } });
        if (!task || task.userEmail !== user.email) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        const updatedTask = await db_1.default.task.update({
            where: { id: parseInt(id) },
            data: { title },
        });
        res.json({ success: true, message: "Task updated", task: updatedTask });
    }
    catch (err) {
        console.error("Update task error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.updateTask = updateTask;
// Toggle task completion
const toggleTask = async (req, res) => {
    const { id } = req.params;
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const task = await db_1.default.task.findUnique({ where: { id: parseInt(id) } });
        if (!task || task.userEmail !== user.email) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        const updatedTask = await db_1.default.task.update({
            where: { id: parseInt(id) },
            data: {
                status: task.status === "active" ? "completed" : "active",
                completedAt: task.status === "active" ? new Date() : null,
            },
        });
        res.json({ success: true, message: "Task toggled", task: updatedTask });
    }
    catch (err) {
        console.error("Toggle task error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.toggleTask = toggleTask;
// Delete task
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const task = await db_1.default.task.findUnique({ where: { id: parseInt(id) } });
        if (!task || task.userEmail !== user.email) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        await db_1.default.task.delete({ where: { id: parseInt(id) } });
        res.json({ success: true, message: "Task deleted" });
    }
    catch (err) {
        console.error("Delete task error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.deleteTask = deleteTask;
