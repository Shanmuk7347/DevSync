import React, { useState } from "react";
import api from "./axios";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function Reset(props) {
  const navigate = useNavigate();
  const { token } = useParams(); // Destructure token correctly from params
  const [upass, setpass] = useState("");
  const [loading, setLoading] = useState(false);

 const handlesubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await api.post(`${process.env.REACT_APP_API_URL}password-reset/confirm/`, {
      password: upass,
      token: token,
    });

    // SUCCESS: Emerald alert
    props.setalert({ 
      msg: "Password reset successful! You can now log in.", 
      type: "success" 
    });

    // Wait 2 seconds so the user sees the success message before redirecting
    setTimeout(() => {
      navigate("/components/home/login");
    }, 2000);

  } catch (error) {
    // ERROR: Red alert for expired or invalid tokens
    const errorMsg = error.response?.data?.detail || 
                     error.response?.data?.message || 
                     "Invalid or expired link";

    props.setalert({ 
      msg: errorMsg, 
      type: "danger" 
    });
    
    // Clear error after 4 seconds
    setTimeout(() => props.setalert(null), 4000);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-sky-500 relative overflow-hidden transition-colors duration-300">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 transition-opacity"></div>

      <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md mx-auto p-8 sm:p-12 z-10 border border-white/20 dark:border-slate-800 transition-all">
        <form onSubmit={handlesubmit} className="space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-sky-100 dark:bg-sky-900/30 p-4 rounded-3xl shadow-inner">
                <Lock className="text-sky-600 dark:text-sky-400" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              New Password
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Secure your account with a strong combination of characters.
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
                Account Security
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <ShieldCheck size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full h-14 pl-12 pr-4 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-sky-500 dark:focus:border-sky-600 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
                  required
                  value={upass}
                  onChange={(e) => setpass(e.target.value)}
                  aria-label="New Password"
                />
              </div>
            </div>

            {/* Validation Hints */}
            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed font-medium">
                <span className="font-bold text-sky-600 dark:text-sky-400">Security Requirement:</span> Use 8+ characters including uppercase, lowercase, and symbols.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-slate-900 dark:bg-sky-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-black dark:hover:bg-sky-700 active:scale-95 transition-all transform shadow-xl shadow-slate-900/20 dark:shadow-sky-900/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Updating...
              </>
            ) : (
              <>
                Confirm Password <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}