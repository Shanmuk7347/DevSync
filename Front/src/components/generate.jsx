import React, { useState } from "react";
import { Sparkles, RefreshCw, Layers, Terminal, BookOpen, AlertCircle } from "lucide-react";
import api from "./axios";

export default function GenerateProject() {
  const [loading, setLoading] = useState(false);

  /* ---------- FORM STATE ---------- */
  const [form, setForm] = useState({
    level: "",
    type: "",
    skills: "",
    team_size: "",
    idea: "",
  });

  /* ---------- AI RESULT STATE ---------- */
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  /* ---------- GENERATE PROJECT ---------- */
  const generateProject = async () => {
    if (!form.level || !form.type || !form.skills) {
      alert("Please fill Skill Level, Project Type and Skills");
      return;
    }

    try {
      setLoading(true);
      setProjects([]);
      setSelectedProject(null);

      const res = await api.post(
        `${process.env.REACT_APP_API_URL}ai/generate`,
        {
          skill_level: form.level,
          project_type: form.type,
          skills: form.skills,
          team_size: form.team_size,
          description: form.idea,
        },
      );

      const generatedData = res.data.projects || [];
      setProjects(generatedData);
      if (generatedData.length > 0) {
        setSelectedProject(generatedData[0]); // auto select first
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate project");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border transition-all duration-200 
    bg-white dark:bg-slate-800 
    border-slate-200 dark:border-slate-700 
    text-slate-900 dark:text-white 
    placeholder-slate-400 dark:placeholder-slate-500
    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`;

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-8 no-scrollbar relative z-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
            AI Project Generator <Sparkles className="text-blue-500" size={32} />
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-lg mx-auto">
            Brainstorm high-quality project ideas, complete with core features and step-by-step implementation guides.
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/20 dark:border-slate-800 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Skill Level</label>
              <select
                className={inputClass}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                value={form.level}
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Project Category</label>
              <select
                className={inputClass}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                value={form.type}
              >
                <option value="">Select Type</option>
                <option value="Startup">Startup</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Open Source">Open Source</option>
                <option value="Learning">Learning</option>
              </select>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Tech Stack</label>
              <input
                type="text"
                placeholder="ex: Python, React, AI"
                className={inputClass}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                value={form.skills}
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Team Size</label>
              <select
                className={inputClass}
                onChange={(e) => setForm({ ...form, team_size: e.target.value })}
                value={form.team_size}
              >
                <option value="">Select Size</option>
                <option value="Solo">Solo</option>
                <option value="2–3 Members">2–3 Members</option>
                <option value="4–6 Members">4–6 Members</option>
              </select>
            </div>
          </div>

          <div className="mt-5 space-y-1 text-left">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Brief Idea (Optional)</label>
            <textarea
              rows="3"
              placeholder="Describe what you want to build..."
              className={`${inputClass} resize-none`}
              onChange={(e) => setForm({ ...form, idea: e.target.value })}
              value={form.idea}
            />
          </div>

          <button
            onClick={generateProject}
            disabled={loading}
            className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {loading ? "Architecting your project..." : "Generate Project with AI"}
          </button>
        </div>

        {/* PROJECT OPTIONS SELECTOR */}
        {projects.length > 1 && (
          <div className="mt-12 mb-6">
            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 text-center uppercase tracking-[0.2em] mb-4">
              Available Blueprints
            </h2>
            <div className="flex justify-center gap-3 flex-wrap">
              {projects.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedProject(p)}
                  className={`px-6 py-2 rounded-full text-xs font-bold border transition-all ${
                    selectedProject?.title === p.title
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                  }`}
                >
                  Blueprint {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GENERATED CONTENT DISPLAY */}
        {selectedProject && (
          <div className="mt-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-[2rem] shadow-2xl p-8 sm:p-10 space-y-10 border border-white/20 dark:border-slate-800 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* TITLE & DESC */}
            <div className="text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {selectedProject.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed text-lg">
                {selectedProject.description}
              </p>
            </div>

            {/* CORE FEATURES */}
            <div className="text-left">
              <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-tighter text-sm">
                <Layers className="text-blue-500" size={18} /> Core Functionalities
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProject.core_features?.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border dark:border-slate-700/50 text-sm">
                    <span className="text-blue-500 font-bold">•</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* IMPLEMENTATION STEPS */}
            <div className="text-left">
              <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-tighter text-sm">
                <Terminal className="text-indigo-500" size={18} /> Implementation Roadmap
              </h4>
              <div className="space-y-4">
                {selectedProject.implementation_steps?.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm py-1.5 border-b dark:border-slate-800 w-full">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* LEARNING GOALS */}
            <div className="text-left">
              <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-tighter text-sm">
                <BookOpen className="text-emerald-500" size={18} /> Learning Outcomes
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.what_to_learn?.map((l, i) => (
                  <span key={i} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-medium border border-emerald-100 dark:border-emerald-800/50">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* DIFFICULTY REASON */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-6 text-left">
              <h4 className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase text-xs">
                <AlertCircle size={16} /> Why this matches your level
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed italic">
                "{selectedProject.difficulty_reason}"
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex pt-4">
              <button
                onClick={generateProject}
                className="flex-1 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Regenerate Different Ideas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}