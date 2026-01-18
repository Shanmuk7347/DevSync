import React from "react";

export default function Alert({ alert }) {
  if (!alert) return null;

  return (
    <div className="
      fixed top-6 right-6
      w-[320px]
      bg-red-500/90 dark:bg-red-600/90 
      backdrop-blur-xl
      border border-white/30 dark:border-white/10
      text-white
      px-5 py-4
      rounded-2xl
      shadow-2xl shadow-red-500/20
      z-[100]
      animate-in fade-in slide-in-from-top-4 duration-300
    ">
      <div className="flex items-center gap-3">
        {/* Subtle Alert Icon */}
        <div className="bg-white/20 p-1.5 rounded-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        
        <h2 className="text-sm font-semibold tracking-wide leading-tight">
          {alert}
        </h2>
      </div>
      
      {/* Subtle Progress Bar Decoration */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl w-full" />
    </div>
  );
}