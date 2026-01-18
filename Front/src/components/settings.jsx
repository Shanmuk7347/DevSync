import React, { useState, useEffect } from "react";
import { PencilLine, LogOut, ShieldCheck, UserCircle, BellRing, Save, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "./axios";

export default function Settings(props) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [change, setChange] = useState({ old: "", p1: "", p2: "" });
  
  // Local state for the skills text field to prevent cursor jumping
  const [skillText, setSkillText] = useState(props.user?.skills?.join(", ") || "");

  // Sync local text if user skills change from outside
  useEffect(() => {
    if (props.user?.skills) {
      setSkillText(props.user.skills.join(", "));
    }
  }, [props.user?.skills]);

  const handleSkillChange = (e) => {
    const val = e.target.value;
    setSkillText(val);
    
    // Parse skills into array and update parent state
    const skillArray = val.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
      
    props.setuser({ ...props.user, skills: skillArray });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (change.p1 !== change.p2) {
      props.setalert("New passwords do not match");
      return;
    }
    try {
      await api.put(`${process.env.REACT_APP_API_URL}change/`, {
        old_password: change.old,
        new_password1: change.p1,
        new_password2: change.p2
      });
      props.setalert("Password updated successfully");
      setChange({ old: "", p1: "", p2: "" });
    } catch (error) {
      props.setalert("Error: Current password incorrect");
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.patch(`${process.env.REACT_APP_API_URL}profile/`, {
        username: props.user.username,
        bio: props.user.bio,
        skills: props.user.skills,
        role: props.user.role,
        experience: props.user.experience,
      });
      props.setalert("Profile saved successfully");
      setIsEditing(false);
    } catch (error) {
      props.setalert(error.message || "Failed to update profile");
    }
  };

  if (!props.user) return <div className="p-10 dark:text-white">Loading profile...</div>;

  // UI Component Styles
  const sectionClass = "bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-all duration-300";
  const inputBase = "w-full p-3 rounded-xl border transition-all duration-200 outline-none";
  const inputActive = "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm";
  const inputDisabled = "bg-slate-50 dark:bg-slate-950/50 border-transparent text-slate-500 dark:text-slate-500 cursor-not-allowed";

  return (
    <div className="h-full w-full flex flex-col px-8 py-6 relative z-10">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-slate-100/60 to-white/40 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 pointer-events-none rounded-t-xl" />

      <div className="relative flex flex-col h-full text-left">
        {/* Header */}
        <div className="mb-6 border-b border-slate-300/60 dark:border-slate-800 pb-4">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Settings</h1>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-10">
          
          {/* PROFILE SECTION */}
          <form className={sectionClass} onSubmit={handleSaveProfile}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCircle size={20} className="text-blue-500" /> Public Profile
              </h2>
              {!isEditing ? (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(true)} 
                  className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
                >
                  <PencilLine size={16} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-4">
                   <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <XCircle size={16} /> Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Username</label>
                <input 
                  className={`${inputBase} ${isEditing ? inputActive : inputDisabled}`} 
                  value={props.user.username || ""} 
                  readOnly={!isEditing} 
                  onChange={(e) => props.setuser({ ...props.user, username: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Email (Private)</label>
                <input className={`${inputBase} ${inputDisabled}`} value={props.user.email || ""} readOnly />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Bio</label>
                <input 
                  className={`${inputBase} ${isEditing ? inputActive : inputDisabled}`} 
                  value={props.user.bio || ""} 
                  readOnly={!isEditing} 
                  onChange={(e) => props.setuser({ ...props.user, bio: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Job Role</label>
                <input 
                  className={`${inputBase} ${isEditing ? inputActive : inputDisabled}`} 
                  value={props.user.role || ""} 
                  readOnly={!isEditing} 
                  onChange={(e) => props.setuser({ ...props.user, role: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Skills (Comma Separated)</label>
                <input 
                  className={`${inputBase} ${isEditing ? inputActive : inputDisabled}`} 
                  value={skillText} 
                  readOnly={!isEditing} 
                  onChange={handleSkillChange} 
                  placeholder="React, Python, AWS..." 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Experience Level</label>
                <select 
                  className={`${inputBase} ${isEditing ? inputActive : inputDisabled}`} 
                  value={props.user.experience || ""} 
                  disabled={!isEditing} 
                  onChange={(e) => props.setuser({ ...props.user, experience: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </form>

          {/* PREFERENCES SECTION */}
          <section className={sectionClass}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <BellRing size={20} className="text-purple-500" /> Preferences
            </h2>
            <div className="flex items-center justify-between max-w-xl">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Dark Mode</p>
                <p className="text-xs text-slate-500">Switch between light and dark themes</p>
              </div>
              <button 
                onClick={() => props.setlight(!props.light)} 
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${!props.light ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${!props.light ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </section>

          {/* SECURITY SECTION */}
          <form className={sectionClass} onSubmit={handlePasswordChange}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-red-500" /> Security
            </h2>
            <div className="max-w-xl space-y-4">
              <input type="password" className={`${inputBase} ${inputActive}`} value={change.old} placeholder="Current Password" onChange={(e) => setChange({ ...change, old: e.target.value })} required />
              <input type="password" className={`${inputBase} ${inputActive}`} value={change.p1} placeholder="New Password" onChange={(e) => setChange({ ...change, p1: e.target.value })} required />
              <input type="password" className={`${inputBase} ${inputActive}`} value={change.p2} placeholder="Confirm New Password" onChange={(e) => setChange({ ...change, p2: e.target.value })} required />
              <button type="submit" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                Update Password
              </button>
            </div>
          </form>

          {/* LOGOUT */}
          <button 
            onClick={() => { localStorage.removeItem("token"); navigate("/components/home"); }} 
            className="w-full py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}