import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Fill all fields!");
      return;
    }

    try {
      const res = await api.post("/auth/register", { fullname: name, email, password });

      if (res.data.success) {
        toast.success(res.data.message || "Registration successful!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Server error!");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden text-white"
      style={{
        backgroundImage:
          "url('https://wallpapers.com/images/hd/relaxing-background-bcx3ae7ekrmwz5qq.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-10 w-96 shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 py-3 rounded-2xl font-semibold transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-white/70">
          Already registered?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

