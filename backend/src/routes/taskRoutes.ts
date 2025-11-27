import { Router } from "express";
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from "../controllers/taskController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// All task routes require authentication
router.use(verifyToken);

router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.patch("/tasks/:id", updateTask);
router.patch("/tasks/:id/toggle", toggleTask);
router.delete("/tasks/:id", deleteTask);

export default router;
