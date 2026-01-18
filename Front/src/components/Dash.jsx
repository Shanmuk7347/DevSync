import React, { useEffect, useState, useRef } from "react";
import api from "./axios";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Homedash from "./homedash";
import Dashd from "../images/dashdbg.png";
import favicon from "../images/favicon.png";
import dashl from "../images/dashbg.png";
import Createproject from "./createproject";
import Viewall from "./viewall";
import Message from "./message";
import FindPartner from "./findpartner";
import GenerateProject from "./generate";
import AIChat from "./aichat";
import TeamsParticipated from "./team";
import ProjectsDone from "./projectsdone";
import Settings from "./settings";
import Alert from "./alerts";
import JoinRequests from "./join";
import { Invitations } from "./invitations";
import OpenSource from "./open";

export default function Dash({ alert, setalert }) {
  const [user, setuser] = useState({
    username: "",
    email: "",
    bio: "",
    role: "",
    skills: [],
    experience: "",
  });

  const [projects, setprojects] = useState([]);
  const [light, setlight] = useState(false);
  const dash = light ? dashl : Dashd;
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchData = async () => {
      try {
        const projectRes = await api.get(`${process.env.REACT_APP_API_URL}projects/`);

        const formattedProjects = projectRes.data.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          techStack: project.skills_req || [],
          category: [project.difficulty_level],
          rolesNeeded: project.role ? [project.role] : [],
          postedBy: project.leader?.username || "Unknown",
          updated: new Date(project.updated_on).toLocaleDateString(),
          joined: project.is_applied,
          reqstatus: project.request_status,
          status: project.status,
        }));

        setprojects(formattedProjects);

        const profileRes = await api.get(`${process.env.REACT_APP_API_URL}profile/`);
        const u = profileRes.data;

        setuser({
          username: u.username ?? "",
          email: u.email ?? "",
          bio: u.bio ?? "",
          skills: Array.isArray(u.skills) ? u.skills : [],
          experience: u.experience ?? "",
          level: (u.level ?? "").toLowerCase(),
          role: u.role ?? "",
        });
      } catch (err) {
        setalert(err.message || "Something went wrong");
        setTimeout(() => setalert(""), 2000);
      }
    };

    fetchData();
  }, [setalert]);

  return (
    /* Top level container toggles 'dark' class */
    <div className={`${!light ? "dark" : ""} transition-colors duration-300`}>
      <div className="bg-gray-200/50 dark:bg-slate-950 text-center relative min-h-screen">
        <Alert alert={alert} />
        
        <div className="relative w-full flex flex-row items-center gap-1 sm:gap-3 justify-center min-h-screen pl-2 sm:pl-5 pr-1 z-10 ">
          
          {/* SIDEBAR */}
          <div className="w-[2.3rem] sm:w-[3.3rem] h-[96vh] mt-2 mb-5 flex flex-col items-center justify-center gap-3 rounded-tl-xl rounded-bl-xl bg-gray-200/50 dark:bg-slate-800/50 shadow-lg shadow-black/50 transition-colors">
            <div>
              <img
                src={favicon}
                alt="Logo"
                className="w-[1.5rem] sm:w-[2.rem] h-[4.7vh]"
              />
            </div>
            
            <div className="bg-white dark:bg-slate-900 h-[85vh] w-[1.8rem] sm:w-[2.4rem] rounded-md flex flex-col gap-4 items-center pt-5 transition-colors">
              <Link to="/components/dash/homedash">
                <i className="fa-regular fa-house text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors"></i>
              </Link>
              <Link to="/components/dash/aichat">
                <svg
                  className="text-slate-600 dark:text-slate-300 hover:text-purple-500 transition-colors"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path
                    fill="currentColor"
                    d="M11.606 2.062a.453.453 0 0 1 .788 0l2.364 4.54a8.47 8.47 0 0 0 4.646 4.646l4.54 2.364a.453.453 0 0 1 0 .788l-4.54 2.364a8.47 8.47 0 0 0-4.646 4.646l-2.364 4.54a.453.453 0 0 1-.788 0l-2.364-4.54a8.47 8.47 0 0 0-4.646-4.646l-4.54-2.364a.453.453 0 0 1 0-.788l4.54-2.364a8.47 8.47 0 0 0 4.646-4.646l2.364-4.54Z"
                  />
                </svg>
              </Link>
              <Link to="/components/dash/team">
                <i className="fa-solid fa-people-group text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors"></i>
              </Link>
              <Link to="/components/dash/mssg">
                <i className="fa-regular fa-comment-dots text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors"></i>
              </Link>
              <Link to="/components/dash/projectsdone">
                <i className="fa-solid fa-list-check text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors"></i>
              </Link>
              <Link to="/components/dash/settings">
                <i className="fa-solid fa-gear text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors"></i>
              </Link>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="w-[100vw] bg-white dark:bg-slate-900 h-[96vh] flex flex-col mt-2 mb-5 rounded-t-xl shadow-lg shadow-black/50 transition-colors overflow-hidden">
            <div
              style={{ backgroundImage: `url(${dash})` }}
              className="relative bg-cover flex items-center justify-center bg-center h-[96vh] rounded-t-xl pl-1"
            >
              {/* Overlay for background images in dark mode to improve readability */}
              <div className="absolute inset-0 bg-white/10 dark:bg-slate-950/40 transition-colors duration-300"></div>
              
              <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar">
                <Routes>
                  <Route index element={<Navigate to="homedash" />} />
                  <Route
                    path="homedash"
                    element={
                      <Homedash projects={projects} setprojects={setprojects} setalert={setalert} user={user}/>
                    }
                  />
                  <Route path="create" element={<Createproject />} />
                  <Route
                    path="view"
                    element={
                      <Viewall projects={projects} setprojects={setprojects} />
                    }
                  />
                  <Route path="mssg" element={<Message />} />
                  <Route path="find" element={<FindPartner />} />
                  <Route path="generate" element={<GenerateProject />} />
                  <Route path="aichat" element={<AIChat />} />
                  <Route path="team" element={<TeamsParticipated />} />
                  <Route path="projectsdone" element={<ProjectsDone alert={alert} setalert={setalert} />} />
                  <Route path="requests" element={<JoinRequests alert={alert} setalert={setalert} />} />
                  <Route path="invite" element={<Invitations />} />
                  <Route path="open" element={<OpenSource />} />
                  <Route
                    path="settings"
                    element={
                      <Settings
                        light={light}
                        setlight={setlight}
                        alert={alert}
                        setalert={setalert}
                        user={user}
                        setuser={setuser}
                      />
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}