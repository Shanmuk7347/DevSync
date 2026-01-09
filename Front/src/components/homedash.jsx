import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import partner from "../images/partner.jpeg";
import project from "../images/project.jpeg";
import explore from "../images/explore.jpeg";
import Profile from "../images/profile.avif"
import { Navigate } from "react-router-dom";

export default function Homedash() {
  const Navigate=useNavigate()
  const course = ["All", "Python", "Java", "Ai"];
  const [selind, setselind] = useState(0);
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI Resume Ranker",
      description:
        "Create an AI powered web application to rank & score resumes based on job keywords using Flask, Python & ML.",
      techStack: ["ML", "Python", "Flask"],
      category: ["AI", "Python"],
      rolesNeeded: ["Backend", "UI Designer"],
      postedBy: "Tara L",
      updated: "1 day ago",
      joined: false,
    },
    {
      id: 2,
      title: "Flutter Blogging Platform",
      description:
        "Build a cross-platform blogging app with Flutter frontend & Node.js backend powered on GCP.",
      techStack: ["Flutter", "Node.js", "GCP"],
      category: ["Mobile", "Backend"],
      rolesNeeded: ["Flutter Dev", "Backend"],
      postedBy: "Adam S",
      updated: "3 days ago",
      joined: false,
    },
  ]);


  return (
    <div className="px-12 ">
      {/* Header */}
      <div className="text-white text-2xl flex flex-col text-center mt-3">
        Welcome, Oleg
        <span className="text-sm">
          Let's Find best coding partner for you
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex flex-row gap-2 mt-4">
        {/* Left Section */}
        <div className="w-[60vw]">
          {/* Top Cards */}
          <div className="bg-white rounded-2xl 
            h-[25vh] lg:h-[42vh]
            w-full
            flex flex-row
            gap-2
            items-center justify-center
            p-4 px-2">

            <div className="part ">
              <img src={partner} alt="partner-logo" className="im" />
              <div className="sub">
                <span>Find a Partner</span>
                <span className="hide">
                  connect with devs who complement your skills and goals
                </span>
                <button className="bn bg-gradient-to-r from-green-500 to-emerald-500">
                  Find
                </button>
              </div>
            </div>

            <div className="part ">
              <img src={project} alt="partner-logo" className="im" />
              <div className="sub">
                <span>Find a Project</span>
                <span className="hide">
                  connect with devs who complement your skills and goals
                </span>
                <button className="bn bg-gradient-to-r from-blue-400 to-blue-500">
                  Generate
                </button>
              </div>
            </div>

            <div className="part ">
              <img src={explore} alt="partner-logo" className="im" />
              <div className="sub">
                <span>Explore Open Source</span>
                <span className="hide">
                  connect with devs who complement your skills and goals
                </span>
                <button className="bn bg-gradient-to-r from-teal-400 to-cyan-400">
                  Explore
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className=" flex flex-col md:flex-row gap-3 mt-3">
            {/* Marketplace */}
            <div className="w-full md:w-[60%] h-auto md:h-[36vh] bg-white/70 rounded-2xl flex flex-col p-2">
              <div className="relative w-full h-[5vh] mt-2">
                <div className="hea">MarketPlace Overview</div>
                <button
                  type="button"
                  className="absolute right-3 shadow hover:scale-105 shadow-black/30 rounded px-2"
                >
                 <i class="fa-solid fa-street-view text-green-500"></i>
                 View All
                </button>
              </div>

              <div className="flex flex-row gap-1 ml-2 mt-3 relative flex-wrap">
                <div className="flex flex-wrap gap-2">
                  {course.map((course, index) => (
                    <span
                      key={index}
                      onClick={() => setselind(index)}
                      className={`course ${
                        selind === index
                          ? "bg-orange-500/20 text-blue"
                          : "bg-gray-200/60"
                      }`}
                    >
                      {course}
                    </span>
                  ))}
                </div>

                <div className="flex flex-row justify-center items-center absolute right-3">
                  <i
                    className="fa-solid fa-angle-left course"
                    onClick={() => selind > 0 && setselind(selind - 1)}
                  ></i>
                  <i
                    className="fa-solid fa-angle-right course"
                    onClick={() =>
                      selind < course.length - 1 && setselind(selind + 1)
                    }
                  ></i>
                </div>
              </div>
              <div className="space-y-4  h-[28vh] overflow-auto no-scrollbar">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-xl p-4 shadow-sm border"
        >
          <div className="flex flex-row justify-start gap-3 items-center">
            <img src={project.profile||Profile} alt="profile" className="rounded-full h-16 w-15"  />
            <div className="flex-flex-col gap-2"><h2 className="text-lg font-semibold">{project.title}</h2>
            
          {/* Tech Stack */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div></div>
          </div>

          <p className="text-sm text-gray-600 mt-1">
            {project.description}
          </p>


          {/* Roles Needed */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {project.rolesNeeded.map((role) => (
              <span
                key={role}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
              >
                {role}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-gray-500">
              Updated {project.updated}
            </span>

            <button
              
              disabled={project.joined}
              className={`px-4 py-2 rounded-lg text-sm font-medium
                ${
                  project.joined
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
            >
              {project.joined ? "Requested" : "Request to Join"}
            </button>
          </div>
        </div>
      ))}
    </div>

            </div>

            {/* Right-bot Widgets */}
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <div className="relative bg-white/80 h-[36vh] rounded-xl">
                <span className="hea">Partner Highlights</span>
              </div>

             
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-2">
        <div className="bg-white relative w-[5vw] lg:w-[27vw] h-[60vh] rounded-xl"> <div className="hea">
                     Notifications
          </div></div>
        <div className="bn bg-blue-500 w-full text-white ">
          {/* Right-bot buttons */}
          <div className="flex flex-row ">
             <span><i class="fa-regular fa-comment-dots"></i></span>       
             <span>Start Chatting</span>
          </div>

        </div> <button onClick={()=>(Navigate("/components/dash/create"))} className="bn bg-gradient-to-r from-green-500 to-emerald-500 w-full">
     Create Project
          </button>
      </div>
      </div>
    </div>
  );
}
