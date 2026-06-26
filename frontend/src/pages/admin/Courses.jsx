import React, { useEffect } from 'react'

import { FaEdit } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setCreatorCourseData } from '../../redux/courseSlice';
import img1 from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
function Courses() {

  let navigate = useNavigate()
  let dispatch = useDispatch()

  const { creatorCourseData } = useSelector(state => state.course)

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })

        await dispatch(setCreatorCourseData(result.data))


        console.log(result.data)

      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }

    }
    getCreatorData()
  }, [])



  return (
    <div className="flex min-h-screen bg-[#05050a] relative">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[320px] h-[320px] bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-[100%] min-h-screen p-4 sm:p-6 lg:px-10 max-w-7xl mx-auto relative z-10 pt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-3 border-b border-white/5 pb-6">
          <div className='flex items-center justify-center gap-4'> 
            <button 
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 shrink-0 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/40 transition group"
            >
              <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <h1 className="text-2xl font-bold text-gray-100">Manage Courses</h1>
          </div>

          <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold px-6 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all font-medium" onClick={() => navigate("/createcourses")}>
            <span className="mr-2">+</span>Create Course
          </button>
        </div>

        {/* For larger screens (table layout) */}
        <div className="hidden md:block bg-[#0c0c14]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="border-b border-white/5 bg-black/40">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-bold uppercase tracking-wider text-xs">Course Name</th>
                <th className="text-left py-4 px-6 text-gray-400 font-bold uppercase tracking-wider text-xs">Pricing (INR)</th>
                <th className="text-left py-4 px-6 text-gray-400 font-bold uppercase tracking-wider text-xs">Current Status</th>
                <th className="text-right py-4 px-6 text-gray-400 font-bold uppercase tracking-wider text-xs w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourseData?.length === 0 && (
                 <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500 text-sm">
                       You haven't created any courses yet.
                    </td>
                 </tr>
              )}
              {creatorCourseData?.map((course, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition duration-200">
                  <td className="py-4 px-6 flex items-center gap-4">
                    {course?.thumbnail ? <img
                      src={course?.thumbnail}
                      alt=""
                      className="w-24 h-14 object-cover rounded-md border border-white/10 shadow-lg"
                    /> : <img src={img1} alt='' className="w-24 h-14 object-cover rounded-md border border-white/10 shadow-lg" />}
                    <span className="font-semibold text-gray-200">{course?.title}</span>
                  </td>
                  {course?.price ? <td className="py-3 px-6 text-gray-300 font-medium">₹{course?.price}</td> : <td className="py-3 px-6 text-gray-500 italic">Not set</td>}
                  <td className="py-3 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${course?.isPublished ? "text-green-400 bg-green-500/10 border border-green-500/20" : "text-amber-500 bg-amber-500/10 border border-amber-500/20"}`}>
                      {course?.isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right">
                    <button 
                      className="p-2 bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 rounded-lg transition-colors text-gray-400"
                      onClick={() => navigate(`/addcourses/${course?._id}`)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-center text-xs text-gray-500 py-4 bg-black/40">
             Showing {creatorCourseData?.length || 0} recent courses.
          </p>
        </div>


        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {creatorCourseData?.length === 0 && (
             <div className="py-12 text-center text-gray-500 text-sm bg-[#0c0c14] rounded-2xl border border-white/5">
                 You haven't created any courses yet.
             </div>
          )}
          {creatorCourseData?.map((course, index) => (
            <div key={index} className="bg-[#0c0c14]/80 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl p-4 flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                {course?.thumbnail ? <img
                  src={course?.thumbnail}
                  alt=""
                  className="w-20 h-16 rounded-md object-cover border border-white/10 shadow-md"
                /> : <img
                  src={img1}
                  alt=""
                  className="w-20 h-16 rounded-md object-cover border border-white/10 shadow-md"
                />}
                <div className="flex-1 overflow-hidden">
                  <h2 className="font-bold text-gray-200 truncate">{course?.title}</h2>
                  {course?.price ? <p className="text-orange-400 text-sm mt-1 font-medium">₹{course?.price}</p> : <p className="text-gray-500 text-sm mt-1 italic">Not set</p>}
                </div>
                <button 
                  className="p-2 shrink-0 bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 rounded-lg transition-colors text-gray-400"
                  onClick={() => navigate(`/addcourses/${course?._id}`)}
                >
                  <FaEdit />
                </button>
              </div>
              <span className={`w-fit px-3 py-1 text-xs font-bold tracking-wide rounded-full ${course?.isPublished ? "text-green-400 bg-green-500/10 border border-green-500/20" : "text-amber-500 bg-amber-500/10 border border-amber-500/20"}`}>
                {course?.isPublished ? "PUBLISHED" : "DRAFT"}
              </span>
            </div>
          ))}
          <p className="text-center text-xs text-gray-500 py-4">
            Showing {creatorCourseData?.length || 0} recent courses.
          </p>
        </div>
      </div>
    </div>
  );

}

export default Courses
