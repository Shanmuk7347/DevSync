import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./auth";
import Login from "./Login";
import Register from "./register";
import Forgot from "./forgot";
import Alert from "./alerts";
import Reset from "./rest";

export default function Home({alert,setalert}) {
  return (
    <div className="relative">
      <Alert alert={alert} />
      <Routes>
        <Route index element={<Navigate to="auth" />} />
        <Route path="auth" element={<Auth />} />
        <Route
          path="login"
          element={<Login alert={alert} setalert={setalert} />}
        />
        <Route
          path="register"
          element={<Register alert={alert} setalert={setalert} />}
        />
        <Route
          path="forgot"
          element={<Forgot alert={alert} setalert={setalert} />}
        />
         <Route
          path="reset/:token"
          element={<Reset alert={alert} setalert={setalert} />}
        />
      </Routes>
    </div>
  );
}
