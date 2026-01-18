import React, { useState, useEffect } from "react";
import { Github, GitFork, ExternalLink, Search, Loader2, Code, ArrowLeft, Info, BookOpen, Terminal, Sparkles, Filter, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "./axios";

export default function OpenSource() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRepo, setExpandedRepo] = useState(null);
  const navigate = useNavigate();

  // Filters start blank as requested
  const [filters, setFilters] = useState({
    language: "",
    topic: "",
    difficulty: ""
  });

  // useEffect is empty - no initial communication with backend
  useEffect(() => {}, []);

  const fetchOpenSourceProjects = async () => {
    // Validation: Ensure user has entered data before communicating with backend
    if (!filters.language.trim() || !filters.topic.trim() || !filters.difficulty) {
      alert("Please fill in the Language, Topic, and select a Difficulty level.");
      return;
    }

    setLoading(true);
    setExpandedRepo(null); 
    try {
      // Direct POST communication with your backend endpoint
      const response = await api.post(`${process.env.REACT_APP_API_URL}ai/opensource/`, filters);
      const data = response.data.repositories || [];
      setRepos(data);
    } catch (error) {
      console.error("Backend communication failed:", error);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const inputClass = `w-full pl-10 pr-4 py-3 rounded-2xl text-sm outline-none transition-all 
    bg-gray-100/50 dark:bg-slate-700/50 
    text-slate-900 dark:text-white 
    placeholder-slate-400 dark:placeholder-slate-500 
    focus:ring-2 focus:ring-teal-500`;

  return (
    <div className="w-full h-full px-4 sm:px-10 py-6 overflow-y-auto no-scrollbar relative z-10 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4 text-left">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 dark:bg-slate-800/40 hover:bg-white/40 dark:hover:bg-slate-700/60 rounded-full text-white transition-all shadow-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 text-left">
              Open Source Explorer <Sparkles className="text-yellow-400" size={24} />
            </h1>
            <p className="text-white/80 text-sm text-left">Search backend for relevant project repositories</p>
          </div>
        </div>
      </div>

      {/* BACKEND QUERY FILTERS */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 mb-8 shadow-2xl border border-white/20 dark:border-slate-800 transition-all">
        <div className="flex items-center gap-2 mb-4 text-teal-700 dark:text-teal-400 font-bold uppercase text-xs tracking-widest">
          <Filter size={14} /> Repository Search Criteria
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          
          {/* Language Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Programming Language</label>
            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text"
                name="language"
                placeholder="e.g. Python, JavaScript"
                value={filters.language}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Topic Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Project Topic</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text"
                name="topic"
                placeholder="e.g. AI, Web, Data"
                value={filters.topic}
                onChange={handleFilterChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Experience Level</label>
            <select 
              name="difficulty" 
              value={filters.difficulty} 
              onChange={handleFilterChange}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all bg-gray-100/50 dark:bg-slate-700/50 text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="" disabled className="dark:bg-slate-800">Select Level</option>
              <option value="Beginner" className="dark:bg-slate-800">Beginner</option>
              <option value="Intermediate" className="dark:bg-slate-800">Intermediate</option>
              <option value="Advanced" className="dark:bg-slate-800">Advanced</option>
            </select>
          </div>
        </div>

        <button 
          onClick={fetchOpenSourceProjects}
          disabled={loading}
          className="mt-6 w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Search Repositories"}
        </button>
      </div>

      {/* RESULTS LIST */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-8 backdrop-blur-md shadow-xl min-h-[50vh] mb-10 border border-white/20 dark:border-slate-800 transition-all">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-teal-500 mb-4" size={48} />
             <p className="text-gray-500 dark:text-slate-400 font-medium tracking-wide">Fetching data from backend...</p>
           </div>
        ) : repos.length === 0 ? (
          <div className="py-20 text-gray-500 dark:text-slate-600 text-center">
            <Code className="mx-auto opacity-10 mb-4" size={80} />
            <p className="text-xl font-bold tracking-tight uppercase">Ready to search</p>
            <p className="text-sm">Enter your preferred stack to see matching projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {repos.map((repo, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-6 hover:shadow-2xl transition-all border-l-[12px] border-l-teal-500 text-left relative group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                      <Github size={32} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white text-2xl tracking-tight leading-none uppercase mb-2">
                        {repo.name}
                      </h3>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-[10px] font-black rounded-full uppercase">
                          {filters.language || "Project Stack"}
                        </span>
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 text-[10px] font-black rounded-full uppercase">
                          {repo.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setExpandedRepo(expandedRepo === idx ? null : idx)}
                    className="px-6 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-300 flex items-center gap-2 transition-all"
                  >
                    <Info size={16} /> Details
                  </button>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                  {repo.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {repo.tech_stack?.map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-400 text-xs font-bold rounded-lg border border-gray-200 dark:border-slate-700 flex items-center gap-1">
                      <Terminal size={14} className="text-teal-500" /> {tech}
                    </span>
                  ))}
                </div>

                {expandedRepo === idx && (
                  <div className="mt-2 p-6 bg-teal-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-teal-100 dark:border-teal-900 space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2 text-left">
                      <h4 className="text-teal-800 dark:text-teal-400 font-black text-sm uppercase tracking-tighter flex items-center gap-2">
                        <BookOpen size={18} /> Readme Summary
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">
                        "{repo.readme_summary}"
                      </p>
                    </div>
                    <div className="space-y-3 text-left">
                      <h4 className="text-teal-800 dark:text-teal-400 font-black text-sm uppercase tracking-tighter flex items-center gap-2">
                        <GitFork size={18} /> Contribution Guide
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {repo.how_to_contribute?.map((step, sIdx) => (
                          <div key={sIdx} className="flex gap-3 bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl border border-teal-50 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm">
                              <div className="font-black text-teal-500">{sIdx + 1}</div>
                              {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <a
                  href={repo.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-slate-900 dark:bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black dark:hover:bg-teal-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-500/10"
                >
                  Inspect Source Code <ExternalLink size={18} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}