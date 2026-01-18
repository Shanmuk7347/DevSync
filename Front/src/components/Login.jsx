import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
// 1. IMPORT THE HOOK
import { useGoogleLogin } from "@react-oauth/google"; 

export default function Login(props) {
  const navigate = useNavigate();
  const location = useLocation();

  // --- REMOVED THE HARDCODED googleResponse OBJECT HERE ---

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/components/dash/homedash");
    }
  }, [navigate]);

  const [user, setuser] = useState({
    email: "",
    password: "",
  });

  // --- 2. NEW GOOGLE LOGIN LOGIC ---
  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code", // CRITICAL: This requests the 'code' for your backend
    
    onSuccess: async (codeResponse) => {
      console.log("Google Code Received:", codeResponse);
      
      try {
        // 3. CORRECT AXIOS SYNTAX (No JSON.stringify needed)
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}auth/google/`,
          {
            code: codeResponse.code,
            // Must match your Backend settings EXACTLY
            callback_url: "http://10.17.3.72.nip.io:3000" 
          }
        );

        console.log("Backend Response:", res.data);

        // Save token and redirect
        // Note: dj-rest-auth usually returns { key: "..." } or { access: "...", refresh: "..." }
        // Check your console.log to see if it is res.data.key or res.data.access
        const token = res.data.access || res.data.key; 
        
        localStorage.setItem("token", token);
        alert("Logged in with Google!");
        navigate("/components/dash/homedash");

      } catch (error) {
  // Add this to see the EXACT error from your backend
  if (error.response) {
    console.error("Backend Error Data:", error.response.data);
    console.error("Backend Error Status:", error.response.status);
  }
  props.setalert("Google Login Failed");
}
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  // ------------------------------------------------

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}auth/login/`, {
        username: user.email, // specific to your backend logic
        email: user.email,
        password: user.password,
      });

      // Check if your backend returns 'access' or 'key'
      localStorage.setItem("token", res.data.access || res.data.key);
      navigate("/components/dash/homedash");
      alert("logged in");
    } catch (error) {
      props.setalert("Wrong credentials");
      setTimeout(() => {
        props.setalert("");
      }, 2000);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-sky-500">
      <form
        className="relative bg-white w-full max-w-md h-auto min-h-[80vh] flex flex-col justify-center items-center gap-4 rounded-2xl shadow-md px-6"
        onSubmit={handlesubmit}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg text-black hover:text-sky-500 hover:bg-sky-50 transition"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <h2 className="text-2xl sm:text-3xl font-semibold text-center mt-6">
          Welcome Back!
        </h2>
        <p className="text-gray-500 text-center text-sm sm:text-base">
          Glad to see you again
        </p>

        <input
          name="Usermail"
          type="text"
          value={user.email}
          onChange={(e) => setuser({ ...user, email: e.target.value })}
          placeholder="Enter User Email"
          className="input w-full p-3 border rounded-lg focus:outline-sky-500"
          required
        />

        <input
          name="Password"
          type="password"
          value={user.password}
          placeholder="Enter Password"
          className="input w-full p-3 border rounded-lg focus:outline-sky-500"
          onChange={(e) => setuser({ ...user, password: e.target.value })}
          required
        />

        <div className="w-full text-right">
          <Link to="/components/home/forgot" className="text-sm text-blue-500 hover:text-blue-700">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full h-11 mt-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Login
        </button>

        <div className="text-gray-500 text-sm mt-2">or sign in with</div>

        {/* GOOGLE BUTTON - Updated onClick */}
        <button
          type="button"
          className="flex items-center justify-center gap-3 w-full h-11 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          onClick={() => handleGoogleLogin()} 
        >
          <i className="fa-brands fa-google text-red-500"></i>
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>

        <div className="absolute bottom-4 text-sm text-gray-600">
          Don't have an account?
          <Link to="/components/register" className="text-blue-500 hover:text-blue-700 ml-1">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}