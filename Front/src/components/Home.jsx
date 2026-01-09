import React from "react";
import { Link } from "react-router-dom";
import flower from "../images/flower.jpeg";

export default function Home() {
  return (
    <div className="min-h-screen  flex flex-col lg:flex-row items-center justify-center relative overflow-hidden bg-sky-500">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 lg:py-0 lg:px-12 z-10">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
          Find Developers
        </h1>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mt-2">
          Build Real Projects
        </h2>
        <p className="text-xl sm:text-3xl lg:text-4xl text-gray-300 font-medium mt-6">
          with <span className="text-white font-bold">Dev-Sync</span>
        </p>

        <div className="hidden lg:flex flex-col sm:flex-row gap-6 mt-12 z-10">
          <Link to="/components/login">
            <button className="px-10 py-4 bg-black text-white font-semibold rounded-lg hover:bg-black-200 transition transform hover:scale-105 shadow-xl">
              Login
            </button>
          </Link>
          <Link to="/components/register">
            <button className="px-10 py-4 bg-transparent text-white border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-black transition transform hover:scale-105 shadow-xl">
              Register
            </button>
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col items-center justify-end relative">
        <div>
          <img
            src={flower}
            alt="Dev-Sync Collaboration"
            className="w-full h-[50vh] sm:h-[60vh] lg:h-[80vh] object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none shadow-2xl"
          />
        </div>

        <div className="flex flex-col gap-4 pb-10 pt-6 lg:hidden w-full max-w-xs px-6">
          <Link to="/components/login" className="w-full">
            <button className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition shadow-lg">
              Login
            </button>
          </Link>
          <Link to="/components/register" className="w-full">
            <button className="w-full py-4 bg-transparent text-white border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-black transition shadow-lg">
              Register
            </button>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 bg-black opacity-20 -z-10"></div>
    </div>
  );
}
