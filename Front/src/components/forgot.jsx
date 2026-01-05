import React from 'react'

export default function Forgot() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="
          relative bg-white
          w-full max-w-md
          h-auto min-h-[80vh]
          flex flex-col
          justify-center items-center
          gap-4
          rounded-2xl
          shadow-md
          px-6
        ">
        <input
          name="Usermail"
          type="text"
          placeholder="Enter User Email"
          className="
            w-full h-11
            bg-black/5
            rounded-md
            text-center
            focus:outline-none
            focus:ring-2 focus:ring-sky-500
          "
          required
        />

      </form>
      
    </div>
  )
}
