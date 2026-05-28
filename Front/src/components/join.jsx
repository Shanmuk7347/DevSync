import React, { useState, useEffect } from "react";
import { Check, X, Loader2, User, ArrowLeft, Inbox, Folder, Eye, Mail, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "./axios";

export default function JoinRequests(props) {
  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [projectsRes, usersRes] = await Promise.all([
        api.get(`${process.env.REACT_APP_API_URL}ownprojects/`),
        api.get(`${process.env.REACT_APP_API_URL}findpartner/`)
      ]);

      const ownProjects = projectsRes.data;
      setAllUsers(usersRes.data);

      const responses = await Promise.all(
        ownProjects.map((project) =>
          api.get(`${process.env.REACT_APP_API_URL}projects/${project.id}/requests`)
        )
      );

      const allRequests = responses.flatMap((r) => r.data);
      setRequests(allRequests);
    } catch (error) {
      // Error: Red alert for data sync failure
      props.setalert({ 
        msg: error.message || "Failed to load dashboard data", 
        type: "danger" 
      });
      setTimeout(() => props.setalert(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  fetchInitialData();
  // Note: Be careful with [props] dependency; usually [props.setalert] is safer
}, [props]); 

const handleAction = async (id, status) => {
  setActionLoading(id);
  try {
    await api.post(`${process.env.REACT_APP_API_URL}requests/${id}/manage`, {
      action: status,
    });
    
    setRequests((prev) => prev.filter((req) => req.id !== id));
    
    // Success: Emerald alert for accepting/rejecting
    props.setalert({ 
      msg: `Request ${status}ed successfully`, 
      type: "success" 
    });
  } catch (error) {
    props.setalert({ 
      msg: error.response?.data?.message || "Failed to update request", 
      type: "danger" 
    });
  } finally {
    setActionLoading(null);
    setTimeout(() => props.setalert(null), 3000);
  }
};

const openProfile = (applicantId) => {
  const user = allUsers.find(u => u.id === applicantId);
  if (user) {
    setSelectedProfile(user);
  } else {
    // Error: If profile search fails
    props.setalert({ 
      msg: "Profile details not found", 
      type: "danger" 
    });
    setTimeout(() => props.setalert(null), 3000);
  }
};

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
        <p className="animate-pulse font-medium text-slate-500 dark:text-slate-400">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-4 sm:px-10 py-6 overflow-y-auto no-scrollbar relative z-10 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 text-left">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/20 dark:bg-slate-800/40 hover:bg-white/40 dark:hover:bg-slate-700/60 rounded-full text-white transition-all shadow-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Pending Approvals</h1>
            <p className="text-white/80 text-xs sm:text-sm">Review applicants for your projects</p>
          </div>
        </div>
      </div>

      {/* Requests Container */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl min-h-[70vh] border border-white/20 dark:border-slate-800">
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-slate-500">
              <Inbox className="mx-auto opacity-20 mb-4" size={64} />
              <p className="text-lg">Your inbox is clear!</p>
            </div>
          ) : (
            requests.map((req) => (
              <div 
                key={req.id} 
                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 hover:shadow-md transition-all border-l-4 border-l-orange-500"
              >
                <div className="flex items-center gap-4 flex-1 w-full text-left">
                  <button 
                    onClick={() => openProfile(req.applicant)}
                    className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center shrink-0 hover:bg-orange-200 transition-colors shadow-inner"
                  >
                    <User size={24} />
                  </button>
                  <div className="overflow-hidden">
                    <button 
                      onClick={() => openProfile(req.applicant)} 
                      className="font-bold text-gray-800 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      @{req.username}
                    </button>
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                      <Folder size={12} />
                      <span className="uppercase tracking-tighter">{req.project_title}</span>
                    </div>
                    <p className="text-gray-500 dark:text-slate-400 text-xs italic line-clamp-1 mt-1">
                      {req.message || "No introduction message provided."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full lg:w-auto shrink-0">
                  <button
                    onClick={() => openProfile(req.applicant)}
                    className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={16} /> Profile
                  </button>
                  <button
                    disabled={actionLoading === req.id}
                    onClick={() => handleAction(req.id, "accept")}
                    className="flex-1 lg:flex-none px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-green-500/20"
                  >
                    {actionLoading === req.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Accept
                  </button>
                  <button
                    disabled={actionLoading === req.id}
                    onClick={() => handleAction(req.id, "reject")}
                    className="flex-1 lg:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X size={16} /> Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PROFILE MODAL */}
      {selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-slate-800">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center text-white relative">
              <button 
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1 rounded-full transition-all"
              >
                <X size={20} />
              </button>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/30 shadow-xl">
                <User size={40} />
              </div>
              <h2 className="text-2xl font-bold">@{selectedProfile.username}</h2>
              <p className="text-blue-100 text-sm flex items-center justify-center gap-1">
                <Mail size={14} /> {selectedProfile.email}
              </p>
            </div>
            
            <div className="p-6 space-y-5 text-left text-gray-800 dark:text-slate-200">
              <div>
                <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Award size={14} className="text-blue-500" /> Experience
                </h4>
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {selectedProfile.experience}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(selectedProfile.skills) ? (
                    selectedProfile.skills.map((skill, i) => (
                      <span key={i} className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-1 rounded text-xs border border-gray-200 dark:border-slate-700">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-1 rounded text-xs border dark:border-slate-700">
                      {selectedProfile.skills || "No skills listed"}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">About</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed italic">
                  {selectedProfile.bio || "No bio available for this user."}
                </p>
              </div>

              <button 
                onClick={() => setSelectedProfile(null)}
                className="w-full py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-black dark:hover:bg-slate-600 transition-colors shadow-lg"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}