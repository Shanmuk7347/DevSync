import React,{useState} from 'react'
import Profile from "../images/profile.avif"

export default function Viewall() {
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
  {
    id: 3,
    title: "Smart Expense Tracker",
    description:
      "Develop a full-stack expense tracker with analytics, JWT authentication and cloud database.",
    techStack: ["React", "Node.js", "MongoDB"],
    category: ["Full Stack", "Finance"],
    rolesNeeded: ["Frontend", "Backend"],
    postedBy: "Neha R",
    updated: "2 days ago",
    joined: false,
  },
  {
    id: 4,
    title: "E-Learning Platform",
    description:
      "Build an online learning platform with video courses, progress tracking and quizzes.",
    techStack: ["Next.js", "Firebase", "Tailwind"],
    category: ["Web", "EdTech"],
    rolesNeeded: ["Frontend", "Content Creator"],
    postedBy: "Rahul K",
    updated: "5 days ago",
    joined: false,
  },
  {
    id: 5,
    title: "Real-Time Chat App",
    description:
      "Create a secure real-time chat application with group chats and media sharing.",
    techStack: ["React", "Socket.io", "Node.js"],
    category: ["Realtime", "Web"],
    rolesNeeded: ["Frontend", "Backend"],
    postedBy: "Ayesha M",
    updated: "1 week ago",
    joined: false,
  },
  {
    id: 6,
    title: "AI Fitness Coach",
    description:
      "AI-based fitness app that generates personalized workout plans using user data.",
    techStack: ["Python", "TensorFlow", "FastAPI"],
    category: ["AI", "Health"],
    rolesNeeded: ["ML Engineer", "Mobile Dev"],
    postedBy: "Kunal P",
    updated: "4 days ago",
    joined: false,
  },
  {
    id: 7,
    title: "Job Portal for Freshers",
    description:
      "Design a job portal focused on fresh graduates with resume upload and job matching.",
    techStack: ["React", "Express", "MySQL"],
    category: ["Career", "Web"],
    rolesNeeded: ["Backend", "UI Designer"],
    postedBy: "Sneha T",
    updated: "6 days ago",
    joined: false,
  },
  {
    id: 8,
    title: "Crypto Price Tracker",
    description:
      "Build a dashboard to track real-time cryptocurrency prices with alerts.",
    techStack: ["Vue.js", "API", "Chart.js"],
    category: ["Finance", "Dashboard"],
    rolesNeeded: ["Frontend", "Data Analyst"],
    postedBy: "Arjun V",
    updated: "2 weeks ago",
    joined: false,
  },
]);

  return (
    <div className=' bg-white rounded-md w-[80vw] max-h-[88vh]  overflow-scroll no-scrollbar'>
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
  )
}
