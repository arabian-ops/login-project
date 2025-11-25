import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Optional: get user from localStorage
const getUser = () => {
  const user = localStorage.getItem("faithResortUser");
  return user ? JSON.parse(user) : null;
};

function App() {
  const user = getUser();

  return (
    <Routes>
      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />

      {/* Catch-all 404 route */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
