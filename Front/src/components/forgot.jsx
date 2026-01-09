import React from 'react';
import { useNavigate,Link } from "react-router-dom";

export default function Forgot() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen k flex items-center justify-center px-4 py-12 bg-sky-500">
      
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-8 sm:p-10 md:p-12 z-10">
       
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-sky-600 transition"
          aria-label="Go back"
        >
          <i className="fa-solid fa-chevron-left text-lg"></i>
          <span className="hidden sm:inline text-sm font-medium">Back</span>
        </button>

       
        <div className="mt-12 text-center space-y-6">
         
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Forgot Password?
          </h1>

          
          <p className="text-lg text-gray-700 font-medium">
            Enter the email associated with your account
          </p>

          
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            We'll send you a link to reset your password securely.
          </p>

          
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-12 px-4 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            required
            aria-label="Email address"
          />

          
          <button
            type="submit"
            className="w-full h-12 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 active:scale-95 transition transform shadow-lg"
          >
            Send Reset Link
          </button>

        
          <p className="text-sm text-gray-600 pt-4">
            Remembered it?{" "}
            <Link to="/components/login" className="text-sky-600 font-medium hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}