import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate} from "react-router-dom";
// 1. IMPORT THE HOOK
import { useGoogleLogin } from "@react-oauth/google"; 

export default function Login(props) {
  const navigate = useNavigate();
  
  useEffect(() => {

    if (localStorage.getItem("token")) {

      navigate("/components/dash/homedash");

    }

  }, [navigate]);
  const [user, setuser] = useState({

    email: "",

    password: "",

  });



  // --- REMOVED THE HARDCODED googleResponse OBJECT HERE ---

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    
    onSuccess: async (codeResponse) => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}auth/google/`,
          {
            code: codeResponse.code,
            callback_url: "http://10.17.3.72.nip.io:3000" 
          }
        );

        const token = res.data.access || res.data.key; 
        localStorage.setItem("token", token);

        // SUCCESS: Object-based alert
        props.setalert({ 
          msg: "Google Login Successful!", 
          type: "success" 
        });

        // Delay navigation slightly so user sees the success alert
        setTimeout(() =>{ navigate("/components/dash/homedash");props.setalert(null)}, 1200);

      } catch (error) {
        if (error.response) {
          console.error("Backend Error Data:", error.response.data);
        }
        // ERROR: Object-based alert
        props.setalert({ 
          msg: "Google Authentication failed. Please try again.", 
          type: "danger" 
        });
        setTimeout(() => props.setalert(null), 3000);
      }
    },
    onError: (error) => {
      props.setalert({ msg: "Google login was cancelled", type: "danger" });
    },
  });

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}auth/login/`, {
        username: user.email, 
        email: user.email,
        password: user.password,
      });

      localStorage.setItem("token", res.data.access || res.data.key);

      // SUCCESS: Object-based alert
      props.setalert({ msg: "Welcome back!", type: "success" });

      setTimeout(() => navigate("/components/dash/homedash"), 1000);
      
    } catch (error) {
      // ERROR: Improved error messaging
      const errorMsg = error.response?.status === 401 
        ? "Invalid email or password" 
        : "Login failed. Please check your connection.";

      props.setalert({ msg: errorMsg, type: "danger" });
      
      setTimeout(() => {
        props.setalert(null);
      }, 3000);
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
          <Link to="/components/home/register" className="text-blue-500 hover:text-blue-700 ml-1">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}