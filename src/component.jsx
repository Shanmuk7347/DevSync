import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login"
import Register from "./components/register";
import Forgot from "./components/forgot";

export default function Component() {
  return (
    <div className="bg-sky-500">
    <Routes>
      <Route index element={<Navigate to="home" />} />
       <Route path="home" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot" element={<Forgot/>} />
    </Routes></div>
  );
}
