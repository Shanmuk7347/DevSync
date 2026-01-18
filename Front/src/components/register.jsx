import React,{useState,useEffect}from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";



export default function Register(props) {
  const navigate=useNavigate();
  useEffect(() => {
  if (localStorage.getItem("token")) {
    navigate("/components/dash/homedash");
  }
 

}, [navigate]);

  const [user,setuser]=useState({
    name:"",
    email:"",
    password1:"",
    password2:""
  })
    const register = async (e) => {
    e.preventDefault();
 try{
    // 1 Register user
    await axios.post(`${process.env.REACT_APP_API_URL}auth/registration/`, {
      username:user.name,
      email:user.email,
      password1:user.password1,
      password2:user.password2
     
    });

    // 2 Login immediately
    const res = await axios.post(`${process.env.REACT_APP_API_URL}auth/login/`, {
       email:user.email,
      password:user.password1,    });

    // 3️ Store JWT
    localStorage.setItem("token", res.data.access);
    navigate("/components/dash/homedash")

    alert("Registered & logged in");
 }catch (error) {
     props.setalert(error.message)
    setTimeout(()=>{props.setalert("")},2000)
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-sky-500">
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
          name="Username"
          type="text"
          value={user.name}
          placeholder="Enter Usename"
          className="
           input 
          "
          onChange={(e)=>(
            setuser({...user,name:e.target.value})
          )}
          required
        />
      
        <input
          name="Usermail"
          type="text"
          value={user.email}
          placeholder="Enter User Email"
          className="
           input 
          "
          onChange={(e)=>(
            setuser({...user,email:e.target.value})
          )}
          required
        />

      
        <input
          name="Password"
          type="password"
          placeholder="Enter Password"
          className="
           input 
          "
          value={user.password1}
          onChange={(e)=>(
            setuser({...user,password1:e.target.value})
          )}
           required
        />
        <input
          name="CPassword"
          type="password"
          value={user.password2}
          placeholder="Confirm Password"
          className="
          input
          "
          onChange={(e)=>(
            setuser({...user,password2:e.target.value})
          )}
           required
        />

       
      

     
        <button
          type="submit"
          onClick={register}
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
