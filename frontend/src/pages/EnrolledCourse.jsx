import React  from 'react'

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

function EnrolledCourse() {
  const navigate = useNavigate()

  const { userData } = useSelector((state) => state.user);

     
   
 

  return (
    <div className="min-h-screen w-full px-4 py-12 bg-[#05050a] relative">
      {/* ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[420px] h-[420px] bg-orange-400/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center mb-10 gap-4">
          <button 
            onClick={()=>navigate("/")}
            className="w-10 h-10 shrink-0 rounded-xl bg-[#0f0f18] border border-orange-500/20 flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/40 transition group"
          >
            <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100">
            My <span className="text-orange-400">Enrolled Courses</span>
          </h1>
        </div>

        {userData.enrolledCourses.length === 0 ? (
          <div className="w-full flex-col flex items-center justify-center py-20 bg-[#0c0c14]/80 backdrop-blur-xl border border-white/5 rounded-3xl mt-12">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🎓</span>
            </div>
            <p className="text-gray-400 text-lg">You haven’t enrolled in any courses yet.</p>
            <button 
              onClick={()=>navigate("/allcourses")}
              className="mt-6 px-6 py-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500 hover:text-black transition font-semibold"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userData.enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="bg-[#0c0c14]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all duration-300 group flex flex-col"
              >
                <div className="relative overflow-hidden w-full h-48">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    {course.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-gray-100 line-clamp-2 leading-tight group-hover:text-orange-400 transition-colors">{course.title}</h2>
                  <div className="flex items-center gap-2 mt-3 mb-5 text-sm text-gray-500">
                     <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-xs">🎓</span>
                     {course.level}
                  </div>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={()=>navigate(`/viewlecture/${course._id}`)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-black font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                      Watch Now
                    </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourse
