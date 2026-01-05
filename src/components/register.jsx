import React from 'react'
import { Link, useNavigate } from "react-router-dom";


export default function Register() {
  const navigate=useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        className="
          relative bg-white
          w-full max-w-md
          h-auto min-h-[80vh]
          flex flex-col
          justify-center items-center
          gap-4
          rounded-2xl
          shadow-md
          px-6
        "

      >
       
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
            absolute top-4 left-4
            flex items-center gap-2
            px-3 py-2
            rounded-lg
            text-black
            hover:text-sky-500
            hover:bg-sky-50
            transition
          "
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

    
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mt-6">
          Hello!  Register
        </h2>
        <p className="text-gray-500 text-center text-sm sm:text-base">
          to get started
        </p>

      
        <input
          name="Usermail"
          type="text"
          placeholder="Enter User Email"
          className="
            w-full h-11
            bg-black/5
            rounded-md
            text-center
            focus:outline-none
            focus:ring-2 focus:ring-sky-500
          "
          required
        />

      
        <input
          name="Password"
          type="password"
          placeholder="Enter Password"
          className="
            w-full h-11
            bg-black/5
            rounded-md
            text-center
            focus:outline-none
            focus:ring-2 focus:ring-sky-500
          "
           required
        />
        <input
          name="CPassword"
          type="password"
          placeholder="Confirm Password"
          className="
            w-full h-11
            bg-black/5
            rounded-md
            text-center
            focus:outline-none
            focus:ring-2 focus:ring-sky-500
          "
           required
        />

       
      

     
        <button
          type="submit"
          className="
            w-full h-11 mt-2
            bg-black text-white
            rounded-md
            hover:bg-gray-800
            transition
          "
        >
          Register
        </button>

        <div className="text-gray-500 text-sm mt-2">
          or sign-up with
        </div>

        
        <button
          type="button"
          className="
            flex items-center justify-center gap-3
            w-full h-11
            border border-gray-300
            rounded-lg
            hover:bg-gray-50
            transition
          "
        >
          <i className="fa-brands fa-google text-red-500"></i>
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>

      
        <div className="absolute bottom-4 text-sm text-gray-600">
           Have an account?
          <Link
            to="/components/login"
            className="text-blue-500 hover:text-blue-700 ml-1"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
