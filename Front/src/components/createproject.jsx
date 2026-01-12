import React, { useState } from "react";

export default function Createproject() {
  const [mem, setmem] = useState(1);
  const [project,setproject]=useState({
    title:"",
    level:"",
    description:"",
    teamtype:"",
    membersname:[""],
    skillsrequired:""
  })
 
  const handl=(e)=>{
 setmem(e.target.value === "team" ? 2 : 1);
 setproject({...project,teamtype:e.target.value})
  }
  const handlemem=(i,v)=>{
    const u=[...project.membersname];
    u[i]=v;
    setproject({...project,membersname:u})


  }
  const level = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div>
      <form
        className=" relative bg-white
           min-w-[33vw]
          h-auto min-h-[80vh]
          flex flex-col
          justify-center items-center
          gap-4
          rounded-2xl
          shadow-md
          px-6"
      
      >
        <div className="  text-xl text-green-500">
          Enter The Project Details
        </div>
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          className="input"
          value={project.title}
          required
          onChange={(e)=>{
            setproject({...project,title:e.target.value})
          }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="input"
          value={project.description}
          required
            onChange={(e)=>{
            setproject({...project,description:e.target.value})
          }}
        />
     <select
  className="input"
  onChange={handl}
  required

>
          <option value="" >
            Select The Team Type
          </option>
          <option value="solo"  >
            Solo
          </option>
          <option value="team" >
            Team
          </option>
        </select>
        <div className="flex flex-col  w-full ">
          <div className="max-h-[15vh] max-w-[29vw] overflow-scroll no-scrollbar">
        {Array.from({length:mem}).map((_, index) => (
          <input
            key={index}
            type="text"
            name={`Member${index}`}
            placeholder={`Name of Member ${index + 1}`}
            required
            
            className="input m-1"
            onChange={(e)=>{handlemem(index,e.target.value)}}
          />
        ))}</div>
        {mem>1&&<button type="button" className="text-sm  flex  justify-end pr-3 hover:text-green-500 text-blue-300" onClick={()=>(setmem(mem+1))}>
         Add Member
        </button>
}

</div>
        

        <input
          type="text"
          className="input "
          placeholder="Enter the skills required"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter skills separated by commas (e.g., React, Node, Python).
        </p>

        <select name="level" id="level" className="input" required>
          <option value="">Select the Level</option>
          {level.map((level) => (
            <option value={level} key={level}>
              {level}
            </option>
          ))}
        </select>
        <button className="bn bg-gradient-to-r from-green-500 to-emerald-500">
          
          Create
        </button>
      </form>
    </div>
  );
}
