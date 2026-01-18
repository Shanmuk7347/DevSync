import React, { useState } from "react";
import api from "./axios";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";

export default function Forgot(props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isreset, setreset] = useState(false);
  const [mail, setmail] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(
        `${process.env.REACT_APP_API_URL}password-reset/`,
        { email: mail }
      );

      // Checking for common success patterns
      if (res.data.status === "OK" || res.status === 200) {
        setreset(true);
      }
    } catch (error) {
      props.setalert(error.response?.data?.message || "No user exists with this email");
      setTimeout(() => props.setalert(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Shared classes for consistent styling in both views
  const wrapperClass = "min-h-screen flex items-center justify-center px-4 py-12 bg-sky-500 relative overflow-hidden transition-colors duration-300";
  const cardClass = "relative bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-md mx-auto p-8 sm:p-10 md:p-12 z-10 border border-white/20 dark:border-slate-800 transition-all";

  // VIEW: Success State (Link Sent)
  if (isreset) {
    return (
      <div className={wrapperClass}>
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 transition-opacity"></div>

        <div className={cardClass}>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-5 rounded-full shadow-inner animate-bounce">
                <CheckCircle className="text-emerald-500" size={48} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Check Your Mail</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                A password reset link has been dispatched to:
                <span className="block font-bold text-slate-900 dark:text-slate-200 mt-1">{mail}</span>
              </p>
            </div>

            <div className="pt-6 border-t dark:border-slate-800">
              <Link
                to="/components/home/login"
                className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-black text-xs uppercase tracking-widest hover:underline"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW: Initial State (Form)
  return (
    <div className={wrapperClass}>
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 transition-opacity"></div>

      <div className={cardClass}>
        {/* Navigation Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors group"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>

        <form onSubmit={handlesubmit} className="mt-8 text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Forgot?
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Enter your registered email to receive a secure recovery link.
            </p>
          </div>

          <div className="relative text-left space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="developer@example.com"
                className="w-full h-14 pl-12 pr-4 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-sky-500 dark:focus:border-sky-600 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
                required
                value={mail}
                onChange={(e) => setmail(e.target.value)}
                aria-label="Email address"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-slate-900 dark:bg-sky-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-black dark:hover:bg-sky-700 active:scale-95 transition-all transform shadow-xl shadow-slate-900/20 dark:shadow-sky-900/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Verifying...
              </>
            ) : (
              "Send Recovery Link"
            )}
          </button>

          <div className="pt-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-tighter">
              Already have an account?{" "}
              <Link
                to="/components/home/login"
                className="text-sky-600 dark:text-sky-400 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}