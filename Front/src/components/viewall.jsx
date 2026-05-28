import React, { useState } from "react";
import Profile from "../images/profile.avif";
import { Search, Send, Clock, User, Hash } from "lucide-react";
import api from "./axios";

export default function Viewall({ projects, setalert }) {
  const [search, setsearch] = useState("");
  const [show, setshow] = useState(null);
  const [request, setresquest] = useState({ message: "", id: "" });

  const sendrequest = async (e) => {
    try {
      await api.post(
        `${process.env.REACT_APP_API_URL}projects/${request.id}/join`,
        { message: request.message }
      );

      // SUCCESS: Object-based alert
      if (setalert) {
        setalert({ 
          msg: "Request sent successfully! The project leader will review it.", 
          type: "success" 
        });
      }

    } catch (error) {
      // ERROR: Object-based alert with backend message
      if (setalert) {
        setalert({ 
          msg: error.response?.data?.message || "Failed to send request", 
          type: "danger" 
        });
      }
    } finally {
      setshow(null);
      // Auto-clear alert
      if (setalert) {
        setTimeout(() => setalert(null), 3000);
      }
    }
  };

  // Optimized filtering with null-checks
  const filteredProjects = projects.filter((project) => {
    const query = search.toLowerCase();
    
    // Helper to safely check string contains
    const includesQuery = (val) => 
      typeof val === 'string' && val.toLowerCase().includes(query);

    return (
      includesQuery(project.title) ||
      includesQuery(project.description) ||
      project.techStack?.some(includesQuery) ||
      project.rolesNeeded?.some(includesQuery)
    );
  });
  const dataToRender = search ? filteredProjects : projects;

  return (
    <div className="w-full px-4 sm:px-8 py-4 transition-colors duration-300 relative z-10">
      {/* SEARCH BAR SECTION */}
      <div className="relative mt-3 max-w-4xl mx-auto group">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Search size={20} />
        </span>

        <input
          type="search"
          placeholder="Search projects..."
          className="w-full h-[56px] pl-14 pr-6 rounded-2xl border transition-all duration-300
          bg-white/90 dark:bg-slate-800/90 backdrop-blur-md
          border-slate-200 dark:border-slate-700 
          text-slate-900 dark:text-white 
          shadow-lg shadow-slate-200/50 dark:shadow-none
          outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
        />
      </div>

      {/* PROJECTS LIST CONTAINER */}
      <div className="mt-8 bg-white/40 dark:bg-slate-950/20 backdrop-blur-sm rounded-[2.5rem] max-h-[82vh] overflow-y-auto no-scrollbar p-6 space-y-4 border border-white/20 dark:border-slate-800">
        {dataToRender.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Search size={64} className="text-slate-400 mb-4" />
            <p className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              No matching projects found
            </p>
          </div>
        ) : (
          dataToRender.map((project, ind) => (
            <div
              key={ind}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 
              shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={Profile}
                      alt="profile"
                      className="rounded-full h-12 w-12 object-cover border-2 border-blue-500/20"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900"></div>
                  </div>

                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                      {project.title}
                    </h2>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <User size={10} /> {project.postedBy} 
                      <span className="opacity-30">•</span>
                      <Clock size={10} /> {project.updated}
                    </div>
                  </div>
                </div>
                
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${project.status === 'open' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                   {project.status || 'Active'}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed italic">
                "{project.description}"
              </p>

              {/* Tech Stack & Roles */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {project.techStack?.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-[10px] font-black uppercase rounded-lg 
                        bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {project.rolesNeeded?.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {project.rolesNeeded.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 text-[10px] font-black uppercase rounded-lg 
                        bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        <Hash size={10} className="inline mr-1" /> {role}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer / Join Action */}
              <div className="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-800/50">
                <button
                  disabled={project.joined || project.status === "closed"}
                  type="button"
                  onClick={() => setshow(ind)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${
                      project.joined || project.status === "closed"
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95"
                    } ${show === ind ? "hidden" : "block"}`}
                >
                  {project.joined && project.reqstatus === "ACCEPTED"
                    ? "Joined"
                    : project.joined
                    ? "Requested"
                    : project.status === "closed"
                    ? "Closed"
                    : "Request to Join"}
                </button>

                {show === ind && (
                  <div className="flex flex-col sm:flex-row w-full gap-3 animate-in slide-in-from-right-4 duration-300">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2.5 rounded-xl border transition-all
                      bg-slate-50 dark:bg-slate-800 
                      border-slate-200 dark:border-slate-700
                      text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setresquest({ ...request, message: e.target.value, id: project.id })}
                      placeholder="Add a short note..."
                    />
                    <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => sendrequest()}
                          className="px-6 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
                        >
                          <Send size={14} /> Send
                        </button>
                        <button
                          type="button"
                          onClick={() => setshow(null)}
                          className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl"
                        >
                          Cancel
                        </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}