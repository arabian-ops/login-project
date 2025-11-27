"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All task routes require authentication
router.use(authMiddleware_1.verifyToken);
router.get("/tasks", taskController_1.getTasks);
router.post("/tasks", taskController_1.createTask);
router.patch("/tasks/:id", taskController_1.updateTask);
router.patch("/tasks/:id/toggle", taskController_1.toggleTask);
router.delete("/tasks/:id", taskController_1.deleteTask);
exports.default = router;
