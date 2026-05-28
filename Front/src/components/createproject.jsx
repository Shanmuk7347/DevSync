import React, { useState } from "react";
import api from "./axios";

export default function Createproject({setalert}) {
  const [mem, setmem] = useState(1);
  const [project, setproject] = useState({
    title: "",
    level: "",
    description: "",
    teamtype: "",
    memberemail: [""],
    skillsrequired: "",
  });

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handl = (e) => {
    const type = e.target.value;
    // Reset to 1 member if team, 0 if solo (though 1 is usually safer for mapping)
    setmem(type === "team" ? 1 : 0);
    setproject({
      ...project,
      teamtype: type,
      memberemail: type === "team" ? [""] : [""],
    });
  };

  const handlemem = (index, value) => {
    const updated = [...project.memberemail];
    updated[index] = value;
    setproject({ ...project, memberemail: updated });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
   try {
  const payload = {
    title: project.title,
    description: project.description,
    project_type: project.teamtype,
    difficulty_level: project.level.toLowerCase(),
    skills_req: project.skillsrequired
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    ...(project.memberemail.map((m) => m.trim()).filter(Boolean).length > 0 && {
      members_email: project.memberemail,
    }),
  };

 await api.post(
    `${process.env.REACT_APP_API_URL}ownprojects/`,
    payload
  );

  // 1. SHOW SUCCESS ALERT
  setalert({ msg: "Project created successfully!", type: "success" });

  setproject({
    title: "",
    level: "",
    description: "",
    teamtype: "",
    memberemail: [""],
    skillsrequired: "",
  });
  setmem(1);

} catch (err) {
  // 2. EXTRACT DETAILED ERROR MESSAGE
  // Checks if backend sent a specific error message, otherwise uses default
  const errorMessage = err.response?.data?.detail || 
                       err.response?.data?.message || 
                       "Failed to create project";

  // 3. SHOW ERROR ALERT
  setalert({ msg: `Error: ${errorMessage}`, type: "danger" });
  
  console.error("BACKEND ERROR:", err.response?.data);
} finally {
  // Optional: Auto-hide after 3 seconds
  setTimeout(() => setalert(null), 3000);
}}
  // Reusable input style class to avoid repetition
  const inputClass = `w-full px-4 py-3 rounded-xl border transition-all duration-200 
    bg-white dark:bg-slate-700 
    border-slate-200 dark:border-slate-600 
    text-slate-900 dark:text-white 
    placeholder-slate-400 dark:placeholder-slate-500
    focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none`;

  return (
    <div className="flex items-center justify-center min-h-full w-full p-4">
      <form
        className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-md 
        w-full max-w-lg flex flex-col gap-5 
        rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-700"
        onSubmit={handlesubmit}
      >
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 text-center mb-2">
          Project Details
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            className={inputClass}
            value={project.title}
            required
            onChange={(e) => setproject({ ...project, title: e.target.value })}
          />

          <textarea
            placeholder="Project Description"
            className={`${inputClass} h-28 resize-none`}
            value={project.description}
            required
            onChange={(e) => setproject({ ...project, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <select 
              className={inputClass} 
              onChange={handl} 
              value={project.teamtype}
              required
            >
              <option value="" className="dark:bg-slate-800">Team Type</option>
              <option value="solo" className="dark:bg-slate-800">Solo</option>
              <option value="team" className="dark:bg-slate-800">Team</option>
            </select>

            <select
              className={inputClass}
              required
              value={project.level}
              onChange={(e) => setproject({ ...project, level: e.target.value })}
            >
              <option value="" className="dark:bg-slate-800">Difficulty</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl} className="dark:bg-slate-800">
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* MEMBER EMAILS SECTION */}
          {project.teamtype === "team" && (
            <div className="flex flex-col w-full gap-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Invite Members
              </label>
              <div className="max-h-32 overflow-y-auto pr-2 space-y-2 no-scrollbar">
                {Array.from({ length: mem }).map((_, index) => (
                  <input
                    key={index}
                    type="email"
                    value={project.memberemail[index] || ""}
                    placeholder={`Email of Member ${index + 1}`}
                    className={inputClass}
                    onChange={(e) => handlemem(index, e.target.value)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-blue-500 dark:text-blue-400 hover:text-emerald-500 transition-colors flex justify-end"
                onClick={() => {
                  setmem(mem + 1);
                  setproject({
                    ...project,
                    memberemail: [...project.memberemail, ""],
                  });
                }}
              >
                + Add Member
              </button>
            </div>
          )}

          <div>
            <input
              type="text"
              className={inputClass}
              placeholder="Skills (React, Django, SQL)"
              required
              value={project.skillsrequired}
              onChange={(e) => setproject({ ...project, skillsrequired: e.target.value })}
            />
            <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 italic px-1">
              * Separate skills with commas
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 
          text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 
          hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 transition-all active:scale-95"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}