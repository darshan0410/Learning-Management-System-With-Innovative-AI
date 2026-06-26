import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

function Profile() {
  let {userData} = useSelector(state=>state.user)
  let navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#05050a] relative flex items-center justify-center p-4">
      {/* ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[420px] h-[420px] bg-orange-400/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-[#0c0c14]/80 backdrop-blur-xl border border-orange-500/15 shadow-[0_0_30px_rgba(249,115,22,0.1)] rounded-3xl p-8 md:p-10 max-w-xl w-full relative z-10">
        
        <button 
          onClick={()=>navigate("/")}
          className="absolute top-6 left-6 md:top-8 md:left-8 w-10 h-10 rounded-xl bg-[#0f0f18] border border-orange-500/20 flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/40 transition group"
        >
          <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mt-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full blur px-[2px] opacity-70"></div>
            {userData.photoUrl ? (
              <img
                src={userData?.photoUrl}
                alt={userData.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#0c0c14] relative z-10"
              />
            ) : (
               <div className='w-28 h-28 rounded-full text-[#0c0c14] flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-orange-500 to-amber-400 border-4 border-[#0c0c14] relative z-10 shadow-[0_0_20px_rgba(249,115,22,0.4)]'>
                {userData?.name.slice(0,1).toUpperCase()}
               </div>
            )}
          </div>
          <h2 className="text-3xl font-bold mt-5 text-gray-100">{userData.name}</h2>
          <span className="inline-block mt-2 px-4 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 capitalize tracking-wider">
            {userData.role}
          </span>
        </div>

        {/* Profile Info */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4 bg-[#0a0a12] p-4 rounded-2xl border border-white/5">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Email Address</p>
              <p className="text-gray-200 mt-0.5">{userData.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-[#0a0a12] p-4 rounded-2xl border border-white/5">
             <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 text-gray-400">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Bio</p>
              <p className="text-gray-300 mt-0.5 leading-relaxed">{userData.description || "No bio added yet."}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0a0a12] p-4 rounded-2xl border border-white/5">
             <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <div className="flex-1 flex justify-between items-center">
              <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
              <span className="w-8 h-8 flex items-center justify-center bg-orange-500/20 text-orange-400 rounded-lg font-bold">
                {userData.enrolledCourses.length}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
           <button 
             onClick={()=>navigate("/editprofile")}
             className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-black font-semibold text-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all"
           >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
