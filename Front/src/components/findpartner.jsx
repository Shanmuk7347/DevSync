import React, { useEffect, useState } from "react";
import { X, Loader2, User, Search, Send, Check, Folder, Award, Info } from "lucide-react"; 
import api from "./axios";

export default function FindPartner({setalert}) {
  const [partners, setPartners] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  
  // Modals & Selection States
  const [selectedPartner, setSelectedPartner] = useState(null); 
  const [connectPartner, setConnectPartner] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [inviteMessage, setInviteMessage] = useState("");
  const [connecting, setConnecting] = useState(false);

  // Search/Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [expFilter, setExpFilter] = useState("Experience Level");

  useEffect(() => {
    const fetchPartners = async () => {
    try {
      const res = await api.get(`${process.env.REACT_APP_API_URL}findpartner/`);
      const formatted = res.data.map((user) => ({
        id: user.id,
        username: user.username,
        bio: user.bio || "No bio provided",
        experience: user.experience || "Beginner",
        skills: Array.isArray(user.skills) ? user.skills : user.skills ? [user.skills] : [],
      }));
      setPartners(formatted);
    } catch (error) {
      // Show error alert if partners fail to load
      setalert({ 
        msg: "Could not load potential partners.", 
        type: "danger" 
      });
      console.error("Fetch partners error:", error);
    } finally {
      setLoading(false);
      // Auto-hide alert after a delay
      setTimeout(() => setalert(null), 3000);
    }
  };
    fetchPartners();
  }, [setalert]);

  

  const fetchMyProjects = async (partner) => {
    setConnectPartner(partner);
    setProjectsLoading(true);
    try {
      const res = await api.get(`${process.env.REACT_APP_API_URL}ownprojects/`);
      setMyProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setalert({ 
        msg: "Failed to retrieve your projects list.", 
        type: "danger" 
      });
      setMyProjects([]);
    } finally {
      setProjectsLoading(false);
      setTimeout(() => setalert(null), 3000);
    }
  };

  const handleFinalConnect = async () => {
    if (!connectPartner || !selectedProject) return;
    try {
      setConnecting(true);
      await api.post(`${process.env.REACT_APP_API_URL}invites/send/`, {
        user_id: connectPartner.id,
        project_id: selectedProject.id,
      });

      // SUCCESS: Using the emerald-green theme
      setalert({ 
        msg: `Invitation sent to ${connectPartner.username}!`, 
        type: "success" 
      });

      setConnectPartner(null);
      setSelectedProject(null);
      setInviteMessage("");
    } catch (error) {
      // ERROR: Using the red theme
      const errorMsg = error.response?.data?.message || error.response?.data?.detail || "Failed to send invitation";
      setalert({ 
        msg: errorMsg, 
        type: "danger" 
      });
    } finally {
      setConnecting(false);
      // Ensure the alert clears
      setTimeout(() => setalert(null), 4000);
    }
  };
  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          p.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExp = expFilter === "Experience Level" || p.experience.toLowerCase() === expFilter.toLowerCase();
    return matchesSearch && matchesExp;
  });

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="w-full h-full px-4 sm:px-10 py-6 overflow-y-auto no-scrollbar text-left relative z-10">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Find a Partner</h1>
        <p className="text-white/80 text-sm sm:text-base">Connect with developers to build your next big project.</p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center shadow-lg border border-transparent dark:border-slate-700 transition-colors duration-300">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search skills (React, AI, Python)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400 transition dark:text-white dark:placeholder-slate-400"
          />
        </div>
        <select 
          className="bg-gray-50 dark:bg-slate-700 rounded-xl px-4 py-2 text-sm outline-none border-none focus:ring-2 focus:ring-blue-400 dark:text-white transition-colors cursor-pointer"
          value={expFilter}
          onChange={(e) => setExpFilter(e.target.value)}
        >
          <option className="dark:bg-slate-800">Experience Level</option>
          <option className="dark:bg-slate-800">Beginner</option>
          <option className="dark:bg-slate-800">Intermediate</option>
          <option className="dark:bg-slate-800">Advanced</option>
        </select>
      </div>

      {/* PARTNERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shadow-inner">
                  <User size={24} /> 
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                   <Check size={12} />
                   <span className="text-[10px] font-bold uppercase">Available</span>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-800 dark:text-white text-lg">@{partner.username}</h3>
              <p className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase mb-3 tracking-wider">{partner.experience}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {partner.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-900 text-[10px] text-gray-600 dark:text-slate-400 rounded border border-gray-200 dark:border-slate-700">{s}</span>
                ))}
                {partner.skills.length > 3 && <span className="text-[10px] text-gray-400 dark:text-slate-500">+{partner.skills.length - 3} more</span>}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setSelectedPartner(partner)}
                className="flex-1 py-2 rounded-xl border border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              >
                Profile
              </button>
              <button 
                onClick={() => fetchMyProjects(partner)}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition active:scale-95"
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: CONNECT / PROJECT SELECTION */}
      {connectPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-2xl flex flex-col overflow-hidden border dark:border-slate-800 transition-all duration-300">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Invite {connectPartner.username}</h2>
              <button onClick={() => {setConnectPartner(null); setSelectedProject(null);}} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-4 overflow-y-auto max-h-[50vh] no-scrollbar">
              <label className="text-xs font-bold uppercase text-gray-400 dark:text-slate-500 tracking-wider">Select Your Project</label>
              
              <div className="space-y-2">
                {projectsLoading ? (
                  <div className="flex justify-center py-6"><Loader2 className="animate-spin text-blue-500" /></div>
                ) : myProjects.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4 italic">You haven't created any projects yet.</p>
                ) : (
                  myProjects.map((proj) => (
                    <div 
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedProject?.id === proj.id 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                        : "border-gray-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Folder size={14} className="text-blue-500" />
                        <h4 className="font-bold text-gray-800 dark:text-slate-200 text-sm">{proj.title}</h4>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <textarea 
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Add a personalized note..."
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl text-sm h-28 outline-none border border-transparent focus:border-blue-200 dark:focus:border-blue-900 dark:text-white resize-none transition"
              />
            </div>

            <div className="p-8 bg-gray-50/80 dark:bg-slate-900/80">
              <button 
                disabled={!selectedProject || connecting}
                onClick={handleFinalConnect}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-600/20"
              >
                {connecting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl border dark:border-slate-800 transition-all duration-300">
            <button onClick={() => setSelectedPartner(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-white"><X size={24}/></button>
            <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 shadow-inner">
                  <User size={40}/>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">@{selectedPartner.username}</h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Award size={14} className="text-blue-500" />
                  <p className="text-blue-500 font-bold text-sm uppercase tracking-widest">{selectedPartner.experience}</p>
                </div>
                
                <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
                  <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter mb-2 flex items-center gap-1">
                    <Info size={12} /> Bio
                  </h4>
                  <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">{selectedPartner.bio}</p>
                </div>

                <button 
                  onClick={() => { fetchMyProjects(selectedPartner); setSelectedPartner(null); }}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  Invite to Project
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}