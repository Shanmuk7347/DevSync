import React, { useState, useEffect } from "react";
import { Check, X, Loader2, Mail, ArrowLeft, Inbox, Briefcase, ChevronDown, ChevronUp, Terminal, Star, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "./axios";

export const Invitations = (props) => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvites = async () => {
    try {
      // Fetch invitations and project details in parallel
      const [invitesRes, projectsRes] = await Promise.all([
        api.get(`${process.env.REACT_APP_API_URL}invites/received/`),
        api.get(`${process.env.REACT_APP_API_URL}projects/`)
      ]);

      const receivedInvites = Array.isArray(invitesRes.data) ? invitesRes.data : [];
      const allProjects = Array.isArray(projectsRes.data) ? projectsRes.data : [];

      const mergedData = receivedInvites.map(invite => {
        const projectDetails = allProjects.find(p => p.id === invite.project_id);
        return {
          ...invite,
          description: projectDetails?.description || "No description available.",
          skills_req: projectDetails?.skills_req || [],
          difficulty: projectDetails?.difficulty_level || "Not specified"
        };
      });

      setInvites(mergedData);
    } catch (error) {
      console.error("Failed to sync invitations and projects:", error);
      // Show error alert if sync fails
      props.setalert({ 
        msg: "Failed to load invitations", 
        type: "danger" 
      });
      setInvites([]);
    } finally {
      setLoading(false);
      setTimeout(() => props.setalert(null), 3000);
    }
  };

    fetchInvites();
  }, [props]);

  const handleAction = async (id, status) => {
    setActionLoading(id);
    try {
      await api.post(`${process.env.REACT_APP_API_URL}invites/${id}/manage/`, {
        action: status,
      });

      // Filter out the processed invite
      setInvites((prev) => prev.filter((inv) => inv.id !== id));

      // SUCCESS: Dynamic message based on action (Accept/Reject)
      props.setalert({ 
        msg: `Invitation ${status === 'accept' ? 'accepted' : 'declined'} successfully!`, 
        type: "success" 
      });

    } catch (error) {
      console.error("Management error:", error);
      // ERROR: Show backend error or fallback
      props.setalert({ 
        msg: error.response?.data?.message || "Failed to update invitation", 
        type: "danger" 
      });
    } finally {
      setActionLoading(null);
      setTimeout(() => props.setalert(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
        <p className="animate-pulse font-medium text-slate-500 dark:text-slate-400">Syncing invitations...</p>
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
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Project Invitations</h1>
            <p className="text-white/80 text-xs sm:text-sm">Manage collaboration invites from other leads</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl min-h-[70vh] border border-white/20 dark:border-slate-800">
        <div className="grid grid-cols-1 gap-4">
          {invites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-slate-500">
              <Inbox className="mx-auto opacity-20 mb-4" size={64} />
              <p className="text-lg font-medium tracking-tight">Your invitation list is clear!</p>
            </div>
          ) : (
            invites.map((inv) => (
              <div
                key={inv.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col hover:shadow-md transition-all border-l-4 border-l-blue-500"
              >
                {/* Main Card Header */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 w-full text-left">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                      <Mail size={24} />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider mb-1">
                        <Briefcase size={12} />
                        <span>{inv.request_type || "Collaboration"}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 dark:text-white text-base leading-tight truncate">
                        {inv.project_title}
                      </h3>
                      <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">
                        From <span className="font-bold text-gray-700 dark:text-slate-200">@{inv.sender_name}</span>
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
                      className="flex items-center gap-1 text-blue-500 dark:text-blue-400 text-[11px] font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-1 rounded-md transition-all border border-blue-100 dark:border-blue-800"
                    >
                      {expandedId === inv.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {expandedId === inv.id ? "Hide Details" : "Project Info"}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full lg:w-auto shrink-0">
                    <button
                      disabled={actionLoading !== null}
                      onClick={() => handleAction(inv.id, "accept")}
                      className="flex-1 lg:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-blue-500/20"
                    >
                      {actionLoading === inv.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      Join
                    </button>
                    <button
                      disabled={actionLoading !== null}
                      onClick={() => handleAction(inv.id, "reject")}
                      className="flex-1 lg:flex-none px-6 py-2 bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-300 border border-gray-100 dark:border-slate-600 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <X size={16} />
                      Decline
                    </button>
                  </div>
                </div>

                {/* Expanded Project Details */}
                {expandedId === inv.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 text-left animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Info size={12}/> Project Description
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed bg-gray-50/50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-50 dark:border-slate-800">
                            {inv.description}
                          </p>
                        </div>
                        {inv.message && (
                          <div className="bg-blue-50/40 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100/50 dark:border-blue-900/30">
                            <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1 font-mono tracking-tighter">Sender Message</h4>
                            <p className="text-xs text-gray-600 dark:text-slate-400 italic">"{inv.message}"</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <Terminal size={12} /> Tech Stack
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {inv.skills_req.length > 0 ? (
                                inv.skills_req.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded border border-blue-100 dark:border-blue-800">
                                      {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400 dark:text-slate-500 italic">No specific tech listed</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Star size={12} /> Difficulty
                          </h4>
                          <span className="text-xs font-bold text-gray-700 dark:text-slate-200 capitalize px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded">
                            {inv.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};