import React, { useEffect, useState } from "react";
import { Users, Shield, User, X, LogOut, AlertCircle, Loader2 } from "lucide-react";
import api from "./axios";

export default function TeamsParticipated({alert,setalert}) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [leaving, setLeaving] = useState(false);

 useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get(`${process.env.REACT_APP_API_URL}myprojects/`);

        const formatted = res.data.map((project) => ({
          id: project.id,
          name: project.title,
          description: project.description,
          role: project.role?.[0] || "Member",
          members: project.members || [],
          leader: project.leader,
          status: project.status === "open" ? "Active" : "Completed",
        }));

        setTeams(formatted);
      } catch (error) {
        // Red alert for failure to load teams
        setalert({ 
          msg: "Failed to load your teams", 
          type: "danger" 
        });
        console.error(error);
      } finally {
        setLoading(false);
        // Clean up alert after 3 seconds
        setTimeout(() => setalert(null), 3000);
      }
    };

    fetchTeams();
  }, [setalert]); // Added proper dependency

  const quitTeam = async () => {
    if (!selectedTeam) return;

    const confirm = window.confirm("Are you sure you want to leave this team?");
    if (!confirm) return;

    try {
      setLeaving(true);
      await api.post(`${process.env.REACT_APP_API_URL}projects/exit`, {
        project_id: selectedTeam.id,
      });

      // Update UI by removing the team from local state
      setTeams((prev) => prev.filter((t) => t.id !== selectedTeam.id));
      setSelectedTeam(null);

      // SUCCESS Alert
      setalert({ 
        msg: `Successfully left the team: ${selectedTeam.name}`, 
        type: "success" 
      });

    } catch (error) {
      // DANGER Alert for backend failure
      const errorMsg = error.response?.data?.message || "Failed to leave team";
      setalert({ 
        msg: errorMsg, 
        type: "danger" 
      });
    } finally {
      setLeaving(false);
      setTimeout(() => setalert(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center transition-colors duration-300">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Syncing your teams...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-8 no-scrollbar relative z-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="text-left mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
              Teams Participated
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xl font-medium">
              A detailed record of teams and projects where you are actively contributing.
            </p>
          </div>
          <Users className="text-blue-500 hidden sm:block" size={40} />
        </div>

        {teams.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <AlertCircle className="text-slate-300 dark:text-slate-700 mb-2" size={48} />
            <p className="text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">
              You haven’t joined any teams yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-4 right-4 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                    team.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                  }`}
                >
                  {team.status}
                </span>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 pr-12 text-left">
                  {team.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 text-left leading-relaxed">
                  {team.description}
                </p>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 mb-6 space-y-2 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Your Role</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{team.role}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Active Members</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {team.members.length + 1}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTeam(team)}
                  className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  Inspect Team
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TEAM DETAILS MODAL */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl border dark:border-slate-800 transition-all duration-300 animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-6">
              <div className="text-left">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                  {selectedTeam.name}
                </h2>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Project Workspace</p>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:rotate-90 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 text-left leading-relaxed">
              {selectedTeam.description}
            </p>

            {/* Members Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                 <Shield size={14} className="text-blue-500" />
                 <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">
                   Verified Collaborators
                 </p>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                {/* Leader Card */}
                <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {selectedTeam.leader.username}
                    </span>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-md">
                    Leader
                  </span>
                </div>

                {/* Member Cards */}
                {selectedTeam.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex justify-between items-center p-3 rounded-2xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{m.username}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Member
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={quitTeam}
                disabled={leaving}
                className="flex-1 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50"
              >
                {leaving ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
                Leave Team
              </button>

              <button
                onClick={() => setSelectedTeam(null)}
                className="flex-1 py-4 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}