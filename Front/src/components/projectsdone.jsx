import React, { useEffect, useState } from "react";
import api from "./axios";
import { PencilLine, Trash2, X, Check, Users, FolderCheck, AlertCircle } from "lucide-react";

export default function ProjectsDone({alert,setalert}) {
  const [projects, setprojects] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editableProject, setEditableProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const removeMemberFromProject = async (projectId, memberId) => {
    const confirmRemove = window.confirm("Remove this member from the project?");
    if (!confirmRemove) return;

    try {
      await api.post(`${process.env.REACT_APP_API_URL}projects/remove/`, {
        project_id: projectId,
        user_id: memberId
      });

      const updateList = (prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.id !== memberId),
      });

      setSelectedProject(updateList);
      setEditableProject(updateList);

      // Success: Green alert
      setalert({ msg: "Member removed successfully", type: "success" });
    } catch (error) {
      setalert({ 
        msg: error.response?.data?.message || "Failed to remove member", 
        type: "danger" 
      });
    } finally {
      setTimeout(() => setalert(null), 3000);
    }
  };

  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Delete this project? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await api.delete(`${process.env.REACT_APP_API_URL}projects/${projectId}/`);
      setprojects((prev) => prev.filter((p) => p.id !== projectId));
      setSelectedProject(null);
      
      // Success: Green alert
      setalert({ msg: "Project deleted successfully", type: "success" });
    } catch (error) {
      setalert({ 
        msg: error.response?.data?.message || "Failed to delete project", 
        type: "danger" 
      });
    } finally {
      setTimeout(() => setalert(null), 3000);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get(`${process.env.REACT_APP_API_URL}ownprojects/`);
        setprojects(res.data);
      } catch (error) {
        setalert({ msg: "Failed to load projects", type: "danger" });
        setTimeout(() => setalert(null), 3000);
      }
    };
    fetchProjects();
    // Using setalert specifically to avoid unnecessary re-renders
  }, [setalert]);

  const saveProjectChanges = async () => {
    try {
      const res = await api.put(
        `${process.env.REACT_APP_API_URL}projects/${editableProject.id}/`,
        {
          title: editableProject.title,
          description: editableProject.description,
          status: editableProject.status,
        }
      );

      setprojects((prev) => prev.map((p) => (p.id === editableProject.id ? res.data : p)));
      setSelectedProject(res.data);
      setEditMode(false);
      
      // Success: Green alert
      setalert({ msg: "Project updated successfully", type: "success" });
    } catch (error) {
      setalert({ 
        msg: error.response?.data?.message || "Failed to update project", 
        type: "danger" 
      });
    } finally {
      setTimeout(() => setalert(null), 3000);
    }
  };

  const inputClass = `w-full px-4 py-2 rounded-xl border transition-all duration-200 
    bg-gray-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 
    text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500`;

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-10 no-scrollbar relative z-10 transition-colors duration-300">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12 text-left">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
          Your Creations <FolderCheck className="text-indigo-500" size={32} />
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-medium">
          Manage and monitor all projects you have initiated. Keep your team updated and track progress.
        </p>
      </div>

      {/* Grid List */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 gap-6">
        {projects.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
             <AlertCircle className="text-slate-300 dark:text-slate-700 mb-2" size={48} />
             <p className="text-slate-500 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">No projects created yet</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="group relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-8 py-7 shadow-sm hover:shadow-xl transition-all duration-300 border-l-[6px] border-l-indigo-500 text-left">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{project.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${project.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500'}`}>
                  {project.status}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => { setSelectedProject(project); setEditableProject({ ...project }); setEditMode(false); }} className="px-6 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg">
                    Manage
                  </button>
                  <button onClick={() => deleteProject(project.id)} className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex -space-x-2">
                   {project.members?.slice(0,3).map((m, i) => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase">
                        {m.username?.charAt(0) || "U"}
                     </div>
                   ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MANAGEMENT MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar border dark:border-slate-800 transition-all duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {editMode ? "Refine Project" : "Project Dashboard"}
              </h2>
              <button onClick={() => { setSelectedProject(null); setEditMode(false); }} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:rotate-90 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 text-left">
              {/* Title Section */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Title</label>
                {editMode ? (
                  <input className={inputClass} value={editableProject.title} onChange={(e) => setEditableProject({ ...editableProject, title: e.target.value })} />
                ) : (
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200 px-1">{editableProject.title}</p>
                )}
              </div>

              {/* Description Section */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Objective</label>
                {editMode ? (
                  <textarea rows={3} className={`${inputClass} resize-none`} value={editableProject.description} onChange={(e) => setEditableProject({ ...editableProject, description: e.target.value })} />
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400 px-1 leading-relaxed">{editableProject.description}</p>
                )}
              </div>

              {/* Status & Team Stats Row */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                  {editMode ? (
                    <select className={inputClass} value={editableProject.status} onChange={(e) => setEditableProject({ ...editableProject, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <div className="px-1 font-bold text-indigo-500 uppercase text-xs">{editableProject.status}</div>
                  )}
                </div>
                <div className="space-y-1 text-right">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Team Size</label>
                   <p className="font-bold text-slate-800 dark:text-slate-200">{editableProject.members?.length || 0} Members</p>
                </div>
              </div>

              {/* Team Members List */}
              <div className="pt-4">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  <Users size={14} /> Personnel Management
                </h4>
                {editableProject.members?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {editableProject.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800 group/item transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-black text-xs text-indigo-500 border dark:border-slate-700">
                              {member.username?.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">@{member.username}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{member.email}</p>
                           </div>
                        </div>
                        <button onClick={() => removeMemberFromProject(editableProject.id, member.id)} className="text-red-500 text-[10px] font-black uppercase hover:underline opacity-0 group-hover/item:opacity-100 transition-opacity">
                          Revoke Access
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-4 text-center border-2 border-dashed dark:border-slate-800 rounded-2xl">Solo project mode active</p>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-8 flex gap-3">
                {editMode ? (
                  <>
                    <button onClick={saveProjectChanges} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                      <Check size={18} /> Update Details
                    </button>
                    <button onClick={() => setEditMode(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl text-xs font-bold uppercase tracking-widest">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditMode(true)} className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-black active:scale-[0.98]">
                    <PencilLine size={18} /> Enter Edit Mode
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}