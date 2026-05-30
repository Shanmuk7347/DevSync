import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";


import Dash from "./components/Dash";

export default function Component() {
//  const token =localStorage.getItem("token")
 
  const [alert,setalert]=useState("")
  return (
    <div >
    
    <Routes>
      <Route index element={<Navigate to="home" />} />
       <Route path="home/*" element={<Home alert={alert} setalert={setalert}/>} />
     
   
      
    <Route
  path="dash/*"
  element={
    <ProtectedRoute>
      <Dash
        alert={alert}
        setalert={setalert}
      />
    </ProtectedRoute>
  }
/>
 
    <Route
      path="dash/*"
      element={<Navigate to="/components/home/login" replace />}
    />
  
    </Routes></div>
  );
}
