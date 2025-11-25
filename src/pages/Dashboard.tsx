import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaList,
  FaClock,
  FaCheck,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import api from "../api/axios";
import cls from "classnames";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Task {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  completedAt?: string | null;
}

const getTimePassed = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const amount = Math.floor(diffInSeconds / unit.seconds);
    if (amount >= 1) return `${amount} ${unit.name}${amount > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

const AdvancedDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/tasks", { headers: { Authorization: `Bearer ${token}` } });
        if (res.data.success) setTasks(res.data.tasks || []);
      } catch {
        console.error("Error fetching tasks");
      }
    };
    fetchTasks();
  }, []);

  const addTask = useCallback(async () => {
    if (!newTask.trim()) return toast.error("Task cannot be empty");
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/tasks", { title: newTask }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setTasks((prev) => [res.data.task, ...prev]);
        setNewTask("");
        toast.success("Task added!");
      }
    } catch {
      toast.error("Error adding task");
    }
  }, [newTask]);

  const completeTask = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(`/tasks/${id}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setTasks((prev) => prev.map((t) => (t.id === id ? res.data.task : t)));
    } catch {
      toast.error("Error updating task");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      toast.error("Error deleting task");
    }
  };

  const saveEdit = async () => {
    if (!editText.trim()) return toast.error("Task cannot be empty");
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(`/tasks/${editingId}`, { title: editText }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setTasks((prev) => prev.map((t) => (t.id === editingId ? res.data.task : t)));
        setEditingId(null);
        setEditText("");
        toast.success("Task edited!");
      }
    } catch {
      toast.error("Error editing task");
    }
  };

  // Filter + search
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (filter === "active") filtered = tasks.filter((t) => !t.completedAt);
    if (filter === "completed") filtered = tasks.filter((t) => t.completedAt);
    if (search) filtered = filtered.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tasks, filter, search]);

  return (
    <div className={cls("min-h-screen flex", darkMode ? "bg-gray-900" : "bg-white/5")}>
      <Toaster />

      {/* Sidebar */}
      <aside className="w-64 p-6 bg-white/10 backdrop-blur text-white flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button onClick={() => setFilter("all")} className={cls("px-4 py-2 rounded-lg flex items-center gap-2 transition", filter === "all" ? "bg-purple-600" : "bg-black/30")}>
          <FaList /> All Tasks
        </button>
        <button onClick={() => setFilter("active")} className={cls("px-4 py-2 rounded-lg flex items-center gap-2 transition", filter === "active" ? "bg-blue-600" : "bg-black/30")}>
          <FaClock /> Active
        </button>
        <button onClick={() => setFilter("completed")} className={cls("px-4 py-2 rounded-lg flex items-center gap-2 transition", filter === "completed" ? "bg-green-600" : "bg-black/30")}>
          <FaCheck /> Completed
        </button>
        <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-2 rounded-lg bg-black/30 flex items-center gap-2">
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <motion.h1 className="text-4xl font-bold text-white mb-6">My To-Do List</motion.h1>

        {/* Add Task */}
        <div className="flex gap-3 mb-6 items-center">
          <input
            type="text"
            className="px-4 py-2 w-72 rounded-xl bg-white/20 text-white placeholder-white/70"
            placeholder="Enter your task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition">
            Add Task
          </button>
        </div>

        {/* Search */}
        <div className="flex justify-start mb-6">
          <input
            type="text"
            className="px-4 py-2 w-72 rounded-xl bg-white/20 text-white placeholder-white/70"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Task List */}
        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul className="space-y-4" ref={provided.innerRef} {...provided.droppableProps}>
                {filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <motion.li
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cls(
                          "p-4 bg-white/10 backdrop-blur rounded-xl flex items-center justify-between border-l-4 hover:shadow-lg transition",
                          task.completedAt ? "border-green-400 opacity-80" : "border-purple-500"
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {/* Left buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => completeTask(task.id)}
                            className={cls("transition", task.completedAt ? "text-green-400" : "text-white")}
                          >
                            <FaCheckCircle size={20} />
                          </button>
                          {editingId === task.id ? (
                            <>
                              <button onClick={saveEdit} className="text-blue-400 hover:text-blue-300">
                                <FaSave size={18} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300">
                                <FaTimes size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditingId(task.id); setEditText(task.title); }} className="text-yellow-400 hover:text-yellow-300">
                                <FaEdit size={18} />
                              </button>
                              <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-300">
                                <FaTrash size={18} />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Task content */}
                        <div className="flex-1 mx-4">
                          {editingId === task.id ? (
                            <input
                              className="w-full bg-white/20 p-1 rounded text-white"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                            />
                          ) : (
                            <p className={cls("text-lg font-medium", task.completedAt ? "line-through text-white/50" : "text-white")}>
                              {task.title}
                            </p>
                          )}
                        </div>

                        <p className="text-sm text-white/50 w-32 text-right">{getTimePassed(task.createdAt)}</p>
                      </motion.li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        {!filteredTasks.length && <p className="text-center text-white/50 py-10">No tasks found.</p>}
      </main>
    </div>
  );
};

export default AdvancedDashboard;
