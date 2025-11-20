import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash, FaEdit, FaSave, FaTimes, FaCheckCircle } from "react-icons/fa";
import api from "../api/axios";

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
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
  ];

  for (const unit of units) {
    const amount = Math.floor(diffInSeconds / unit.seconds);
    if (amount >= 1) {
      return `${amount} ${unit.name}${amount > 1 ? 's' : ''} ago`;
    }
  }

  return "just now";
};


const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setTasks(res.data.tasks || []);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = useCallback(async (): Promise<void> => {
    if (!newTask.trim()) {
      toast.error("Task cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/tasks",
        { title: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setTasks((prev) => [res.data.task, ...prev]);
        setNewTask("");
        toast.success("Task added!");
      } else {
        toast.error(res.data.message || "Failed to add task");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error adding task");
    } finally {
      setLoading(false);
    }
  }, [newTask]);

  const completeTask = useCallback(async (id: number): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/tasks/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? res.data.task : t))
        );
        toast.success("Task updated!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating task");
    }
  }, []);

  const deleteTask = useCallback(async (id: number): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        toast("Task deleted", { icon: "🗑️" });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting task");
    }
  }, []);

  const startEdit = (task: Task): void => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = useCallback(async (): Promise<void> => {
    if (!editText.trim()) {
      toast.error("Task cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/tasks/${editingId}`,
        { title: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === editingId ? res.data.task : t))
        );
        setEditingId(null);
        setEditText("");
        toast.success("Task edited!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error editing task");
    }
  }, [editingId, editText]);


  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aCompleted = !!a.completedAt;
      const bCompleted = !!b.completedAt;
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks]);

  return (
    <div
      className="min-h-screen relative text-white overflow-hidden"
      style={{
        backgroundImage:
          "url('https://w0.peakpx.com/wallpaper/600/891/HD-wallpaper-midnight-calm-stars-dark-peaceful-reflections-sky-night.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Toaster position="top-right" />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold text-center my-10 z-10 relative"
      >
        My To-Do List
      </motion.h1>

      
      <div className="flex justify-center gap-4 mb-10 relative z-10">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="px-4 py-2 w-72 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 transition-all"
          placeholder="Enter your task..."
        />
        <button
          onClick={addTask}
          className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl transition-colors"
        >
          Add Task
        </button>
      </div>

      
      <div className="flex justify-center p-4 relative z-10">
        <ul className="w-full max-w-4xl space-y-4">
          {sortedTasks.map((task: Task) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className={`bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between transition-all border-l-4 ${
                task.completedAt ? "border-green-400 opacity-70" : "border-purple-600"
              }`}
            >
              
              
              <div className="flex items-center space-x-3 text-lg">
                 <button
                    onClick={() => completeTask(task.id)}
                    className={`p-2 rounded-full transition-colors ${
                      task.completedAt ? "text-green-400 hover:text-white" : "text-white/60 hover:text-green-400"
                    }`}
                    title={task.completedAt ? "Mark Not Done" : "Mark Done"}
                >
                    <FaCheckCircle />
                </button>
                
                {editingId === task.id ? (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => saveEdit()}
                            className="text-blue-400 hover:text-blue-300 p-2"
                            title="Save"
                        >
                            <FaSave />
                        </button>
                        <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 hover:text-gray-300 p-2"
                            title="Cancel"
                        >
                            <FaTimes />
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => startEdit(task)}
                            className="text-yellow-400 hover:text-yellow-300 p-2"
                            title="Edit"
                        >
                            <FaEdit />
                        </button>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-400 hover:text-red-300 p-2"
                            title="Delete"
                        >
                            <FaTrash />
                        </button>
                    </div>
                )}
              </div>

              
              <div className="flex-1 min-w-0 mx-4">
                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    className="w-full bg-white/20 p-1 rounded text-white"
                  />
                ) : (
                  <p
                    className={`font-medium text-lg truncate ${
                      task.completedAt ? "line-through text-white/60" : "text-white"
                    }`}
                  >
                    {task.title}
                  </p>
                )}
              </div>
              
             
              <p className="text-sm text-white/50 w-32 text-right flex-shrink-0">
                Added {getTimePassed(task.createdAt)}
              </p>
            </motion.li>
          ))}
          {!tasks.length && (
            <div className="text-center text-white/50 p-10">
                No tasks yet! Add one above to get started.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;