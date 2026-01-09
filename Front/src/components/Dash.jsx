import React from "react";
import {Routes,Route,Navigate} from "react-router-dom"
import Homedash from "./homedash";
import favicon from "../images/favicon.png";
import dash from "../images/dashbg.png";
import Createproject from "./createproject";


export default function Dash() {
  return (
    <div className="bg-gray-200/50 text-center">
      <div class="relative w-full flex flex-row items-center  gap-1 sm:gap-3 justify-center min-h-screen  pl-2 sm:pl-5 pr-1 z-10 ">
        <div
          className="
              w-[2.3rem]
               sm:w-[3.3rem]
                h-[96vh]
  mt-2 mb-5
  flex flex-col items-center justify-center gap-3
  rounded-tl-xl rounded-bl-xl
  bg-gray-200/50
  shadow-lg shadow-black/50
"
          //
        >
          <div>
            <img src={favicon} alt="Logo" className="w-[1.5rem]sm:w-[2.rem] h-[4.7vh] " />
          </div>
          <div className="bg-white h-[85vh] w-[1.8rem] rounded-md flex flex-col gap-4 items-center pt-5">
            <i className="fa-regular fa-house icon"></i>
            <svg class="gemini-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M11.606 2.062a.453.453 0 0 1 .788 0l2.364 4.54a8.47 8.47 0 0 0 4.646 4.646l4.54 2.364a.453.453 0 0 1 0 .788l-4.54 2.364a8.47 8.47 0 0 0-4.646 4.646l-2.364 4.54a.453.453 0 0 1-.788 0l-2.364-4.54a8.47 8.47 0 0 0-4.646-4.646l-4.54-2.364a.453.453 0 0 1 0-.788l4.54-2.364a8.47 8.47 0 0 0 4.646-4.646l2.364-4.54Z"/>
</svg>
            <i className="fa-solid fa-people-group icon"></i>
            <i className="fa-regular fa-comment-dots icon"></i>
            <i className="fa-solid fa-list-check icon"></i>
            <i className="fa-solid fa-gear icon"></i>
          </div>
        </div>
        <div className="w-[100vw] bg-white h-[96vh] flex flex-col mt-2 mb-5 shadow-lg shadow-black/50">
          <div className="flex flex-row relative ml-2">
            <span className="flex items-center justify-center absolute top-2 left-2 text-black/30">
              <i class="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="search"
              placeholder="Search..."
              class="w-[calc(100vw-7.5rem)] h-[5vh] pl-10 pr-3 py-2 rounded-2xl border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
          </div>
          <div
            style={{ backgroundImage: `url(${dash})` }}
            className="relative bg-cover bg-center h-[90vh] m-1.5 mb-0 rounded-t-xl pl-1"
          >
            <Routes>
              <Route index element={<Navigate to="homedash"/>}/>
              <Route path="homedash" element={<Homedash/>}/>
              <Route path="create" element={<Createproject/>}/>
            </Routes>
          </div>
          <div className="absolute inset-0 bg-black/20 -z-10"></div>
        </div>
      </div>
    </div>
  );
}
