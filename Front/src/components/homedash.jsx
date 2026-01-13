import React, { useState } from "react";
import { UserPlus, MessageSquare, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import partner from "../images/partner.jpeg";
import project from "../images/project.jpeg";
import explore from "../images/explore.jpeg";
import Profile from "../images/profile.avif";

export default function Homedash() {
  const navigate = useNavigate();
  const notificationIconMap = {
  join: UserPlus,
  message: MessageSquare,
  update: Bell,
};

const notificationColorMap = {
  join: "bg-green-100 text-green-600",
  message: "bg-blue-100 text-blue-600",
  update: "bg-purple-100 text-purple-600",
};

 
const notifications = [
  {
    id: 1,
    type: "join",
    message: "Aarav Mehta requested to join your project",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "message",
    message: "Priya Sharma sent you a message",
    time: "10 min ago",
    read: false,
  },
  {
    id: 3,
    type: "update",
    message: "Your project status was updated",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "join",
    message: "Rohan Verma joined your project",
    time: "Yesterday",
    read: true,
  },
];

  const partnerHigh = [
    {
      id: 1,
      name: "Aarav Mehta",
      role: "Frontend Developer",
      skills: ["React", "Tailwind"],
      level: "Beginner",
      status: "Available",
      avatar: "AM",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Backend Developer",
      skills: ["Node.js", "MongoDB"],
      level: "Intermediate",
      status: "Busy",
      avatar: "PS",
    },
    {
      id: 3,
      name: "Rohan Verma",
      role: "ML Engineer",
      skills: ["Python", "TensorFlow"],
      level: "Advanced",
      status: "Available",
      avatar: "RV",
    },
    {
      id: 4,
      name: "Sneha Patel",
      role: "UI/UX Designer",
      skills: ["Figma", "UX Research"],
      level: "Beginner",
      status: "Available",
      avatar: "SP",
    },
  ];

  const course = ["All", "Python", "Java", "Ai"];
  const [selind, setselind] = useState(0);
  const [projects] = useState([
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
        <span className="text-sm">Let's Find best coding partner for you</span>
      </div>

      {/* Main Layout */}
      <div className="flex flex-row gap-2 mt-4">
        {/* Left Section */}
        <div className="w-[60vw]">
          {/* Top Cards */}
          <div
            className="bg-white rounded-2xl 
            h-[25vh] lg:h-[42vh]
            w-full
            flex flex-row
            gap-2
            items-center justify-center
            p-4 px-2"
          >
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
                <div className="hea">MarketPlace Overview
                <button
                  type="button"
                  className="absolute right-3 shadow hover:scale-105 shadow-black/30 rounded px-2 text-sm"
                  onClick={() => {
                    navigate("/components/dash/view");
                  }}
                >
                  <i class="fa-solid fa-street-view text-green-500 "></i>
                  View All
                </button></div>
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
                      <img
                        src={project.profile || Profile}
                        alt="profile"
                        className="rounded-full h-16 w-15"
                      />
                      <div className="flex-flex-col gap-2">
                        <h2 className="text-lg font-semibold">
                          {project.title}
                        </h2>

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
                        </div>
                      </div>
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
              <div className=" bg-white/80 h-[36vh] rounded-xl">
                <span className="hea">Partner Highlights</span>

                <div className="flex flex-col gap-3 h-[calc(36vh-43px)] content-start overflow-scroll no-scrollbar ">
                  {partnerHigh.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {partner.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{partner.name}</p>
                        <p className="text-xs text-gray-500">{partner.role}</p>
                      </div>

                      {/* Status */}
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          partner.status === "Available"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {partner.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-2">
          <div className="bg-white relative w-[5vw] lg:w-[27vw] h-[60vh] rounded-xl">
           
            <div className="hea">Notifications</div>
             <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
    {notifications.map((item) => {
      const Icon = notificationIconMap[item.type];

      return (
        <div
          key={item.id}
          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer
            ${item.read ? "bg-white" : "bg-blue-50"}`}
        >
          {/* Icon */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center
              ${notificationColorMap[item.type]}`}
          >
            <Icon size={16} />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className={`text-sm ${item.read ? "text-gray-700" : "font-medium"}`}>
              {item.message}
            </p>
            <span className="text-xs text-gray-400">
              {item.time}
            </span>
          </div>

          {/* Unread dot */}
          {!item.read && (
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
          )}
        </div>
      );
    })}
  </div>
          </div>
          <button
            onClick={() => navigate("/components/dash/mssg")}
            type="button"
            className="bn bg-blue-500 w-full text-white "
          >
            {/* Right-bot buttons */}
            <div className="flex flex-row ">
              <span>
                <i class="fa-regular fa-comment-dots"></i>
              </span>
              <span>Start Chatting</span>
            </div>
          </button>{" "}
          <button
            onClick={() => navigate("/components/dash/create")}
            className="bn bg-gradient-to-r from-green-500 to-emerald-500 w-full"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
