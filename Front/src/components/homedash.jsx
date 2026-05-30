import React, { useState, useEffect } from "react";
import { UserPlus, MessageSquare, Bell, CheckCircle, Rocket, Sparkles, Globe, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import partner from "../images/partner.jpeg";
import project from "../images/project.jpeg";
import explore from "../images/explore.jpeg";
import Profile from "../images/profile.avif";
import api from "./axios";

export default function Homedash({alert,setalert}) {
  const navigate = useNavigate();
  const [show, setshow] = useState(null);
  const [request, setresquest] = useState({ message: "", id: "" });
  const [selind, setselind] = useState(0);
  const [notifications, setnotifications] = useState([]);

  // Refined styles: ensures text is dark in light mode and light in dark mode
  const notificationStyles = {
    join_request: "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/30 dark:border-orange-800 dark:text-orange-300",
    Invitation: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300",
    request_accepted: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300",
    message: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-300",
    request_rejected: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300",
    default: "bg-gray-50 border-gray-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
  };

  const notificationIconMap = {
    join: UserPlus,
    message: MessageSquare,
    update: Bell,
    join_request: UserPlus,
    request_accepted: CheckCircle,
    request_rejected: Bell,
    project_invite: Globe,
  };

  const course = ["All", "Python", "Java", "Ai"];

  const partnerHigh = [
    { id: 1, name: "Aarav Mehta", role: "Frontend Developer", status: "Available", avatar: "AM" },
    { id: 2, name: "Priya Sharma", role: "Backend Developer", status: "Busy", avatar: "PS" },
    { id: 3, name: "Rohan Verma", role: "ML Engineer", status: "Available", avatar: "RV" },
    { id: 4, name: "Sneha Patel", role: "UI/UX Designer", status: "Available", avatar: "SP" },
  ];

  useEffect(() => {
    const formatTimeAgo = (dateString) => {
      const diff = Date.now() - new Date(dateString).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
    };

    const fetchNotifications = async () => {
      try {
        const res = await api.get(`${process.env.REACT_APP_API_URL}notifications/`);
        const formatted = res.data.map((n) => ({
          id: n.id,
          type: n.notification_type,
          message: n.message,
          read: n.is_read,
          time: formatTimeAgo(n.created_at),
          sender_name: n.sender_name,
          target_id: n.target_id,
        }));
        setnotifications(formatted);
      } catch (error) {
        // Safe access to setalert
       if (setalert) {
  setalert({ 
    msg: "Failed to load notifications", 
    type: "danger" 
  });
  
  // Optional: manual timeout if you haven't added auto-dismiss to the Alert component yet
  setTimeout(() => setalert(null), 3000);
}
      }
    };

    fetchNotifications();
  }, [{alert,setalert}]); // Dependency warning resolved

  const sendrequest = async (e) => {
    try {
      await api.post(`${process.env.REACT_APP_API_URL}projects/${request.id}/join`, { message: request.message });
      alert("Request sent");
    } catch (error) {
      setalert(error.response?.data?.message || "Failed to send request");
    } finally {
      setshow(null);
    }
  };

  const handleNotificationClick = (item) => {
    if (item.type === 'join_request') navigate(`/components/dash/requests`);
    else if (item.type === 'project_invite') navigate(`/components/dash/invite`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-12 h-full overflow-y-auto no-scrollbar relative z-10 transition-colors duration-300">
      {/* HEADER - Updated text-slate-900 for Light Mode visibility */}
      <div className="text-slate-900 dark:text-white text-xl sm:text-2xl text-center py-6">
        <h1 className="font-bold">Welcome, {{alert,setalert}.user.username}</h1>
        <span className="block text-sm text-slate-600 dark:text-white/80 italic">Let’s find the best coding partner for you</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-1">
        <div className="w-full lg:w-[60vw] flex flex-col gap-4">
          
          {/* Top Cards */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl w-full grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
            {[
              { title: "Find a Partner", img: partner, path: "/components/dash/find", color: "from-green-500 to-emerald-500", icon: <UserPlus size={14}/> },
              { title: "Generate Project", img: project, path: "/components/dash/generate", color: "from-blue-500 to-indigo-500", icon: <Sparkles size={14}/> },
              { title: "Open Source", img: explore, path: "/components/dash/open", color: "from-teal-400 to-cyan-500", icon: <Globe size={14}/> }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2 p-2 rounded-xl group hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <img src={item.img} className="w-full h-24 object-cover rounded-lg shadow-md group-hover:scale-[1.02] transition-transform" alt={item.title} />
                <span className="font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">{item.title}</span>
                <button onClick={() => navigate(item.path)} className={`w-full py-2 bg-gradient-to-r ${item.color} text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all`}>
                  {item.icon} Go
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Marketplace */}
            <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest flex items-center gap-2">
                  <Rocket size={16} className="text-orange-500" /> Marketplace
                </h2>
                <button onClick={() => navigate("/components/dash/view")} className="flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 hover:scale-105 transition-all bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                  <Eye size={12}/> View All
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {course.map((c, i) => (
                  <button key={i} onClick={() => setselind(i)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${selind === i ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200"}`}>{c}</button>
                ))}
              </div>

              <div className="space-y-3 max-h-[35vh] overflow-y-auto no-scrollbar pr-2">
                {{alert,setalert}.projects.filter(p => p.status !== "closed").length === 0 ? (
                  <div className="text-center text-slate-400 dark:text-slate-600 py-10 italic">No active projects</div>
                ) : (
                  {alert,setalert}.projects.filter(e => e.status !== "closed").slice(0, 4).map((project, ind) => (
                    <div key={ind} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={Profile} className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-600" alt="user" />
                        <div className="text-left">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{project.title}</h3>
                          <p className="text-[10px] text-slate-400">{project.updated}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 text-left">{project.description}</p>
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => setshow(ind)} 
                          className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg transition-all ${project.joined ? "bg-slate-200 dark:bg-slate-700 text-slate-500" : "bg-green-500 text-white hover:bg-green-600 active:scale-95"}`}
                          disabled={project.joined}
                        >
                          {project.joined ? "Requested" : "Join"}
                        </button>
                      </div>
                      {show === ind && (
                        <div className="mt-3 flex gap-2 animate-in slide-in-from-top-2 duration-300">
                          <input type="text" className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white outline-none" placeholder="Message..." onChange={(e) => setresquest({ ...request, message: e.target.value, id: project.id })} />
                          <button onClick={sendrequest} className="bg-blue-600 text-white text-[10px] px-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">Send</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Partner Highlights */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-slate-800 transition-colors">
              <h2 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest mb-4 text-left">Top Partners</h2>
              <div className="space-y-3">
                {partnerHigh.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 bg-white dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs shrink-0">{p.avatar}</div>
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{p.name}</p>
                      <p className="text-[9px] text-slate-500 uppercase truncate">{p.role}</p>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${p.status === "Available" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-600"}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Notifications */}
        <div className="w-full lg:w-[30vw] flex flex-col gap-4">
          <div className="h-[73vh] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col shadow-xl transition-colors">
            <h2 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest mb-4 text-left flex items-center gap-2">
              <Bell size={14} className="text-blue-500" /> Inbox
            </h2>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
              {notifications.map((item, index) => {
                const Icon = notificationIconMap[item.type] || Bell;
                const style = notificationStyles[item.type] || notificationStyles.default;
                return (
                  <div key={index} onClick={() => handleNotificationClick(item)} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer hover:scale-[1.02] active:scale-95 transition-all ${style} ${item.read ? "opacity-60 grayscale-[0.5]" : "shadow-md"}`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/50 dark:bg-slate-900/50 shrink-0"><Icon size={14} /></div>
                    <div className="flex-1 text-left">
                      <span className="text-[8px] font-black uppercase opacity-60 tracking-widest">{item.type.replace("_", " ")}</span>
                      <p className="text-xs font-bold leading-tight mt-0.5">{item.message}</p>
                      <span className="text-[9px] opacity-60 mt-1 block italic">{item.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => navigate("/components/dash/mssg")} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
              <MessageSquare size={16} /> Chat
            </button>
            <button onClick={() => navigate("/components/dash/create")} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}