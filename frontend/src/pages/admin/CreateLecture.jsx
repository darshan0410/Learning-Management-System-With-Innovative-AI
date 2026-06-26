import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';

function CreateLecture() {
    const navigate = useNavigate()
    const {courseId} = useParams()
    const [lectureTitle , setLectureTitle] = useState("")
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()
    const {lectureData} = useSelector(state=>state.lecture)
    

    const createLectureHandler = async () => {
      setLoading(true)
      try {
        const result = await axios.post(serverUrl + `/api/course/createlecture/${courseId}` ,{lectureTitle} , {withCredentials:true})
        console.log(result.data)
      dispatch(setLectureData([...lectureData,result.data.lecture]))
        toast.success("Lecture Created")
        setLoading(false)
        setLectureTitle("")
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
        setLoading(false)
      }
    }

    useEffect(()=>{
      const getLecture = async () => {
        try {
          const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`,{withCredentials:true})
        console.log(result.data)
        dispatch(setLectureData(result.data.lectures))
        

          
        } catch (error) {
           console.log(error)
        toast.error(error.response.data.message)
        
        }
        
      }
      getLecture()
    },[])

   
  
  return (
     <div className="min-h-screen bg-[#05050a] relative flex items-start sm:items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Ambient Backdrops */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[10%] left-[10%] w-[320px] h-[320px] bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-[#0c0c14]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-3xl p-6 sm:p-10 relative z-10 mt-10 sm:mt-0">
        
        {/* Header */}
        <div className="mb-8 border-b border-white/5 pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-3">
             <span className="text-orange-500">➕</span> Let’s Add a Lecture
          </h1>
          <p className="text-sm text-gray-400 mt-2">Enter a descriptive title to add new modular video lectures to your course.</p>
        </div>

        {/* Input */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-400 mb-2">Lecture Title</label>
          <input
            type="text"
            placeholder="e.g. Introduction to MERN Stack"
            className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder-gray-600"
            onChange={(e)=>setLectureTitle(e.target.value)}
            value={lectureTitle}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-white/5">
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 text-gray-300 hover:text-orange-400 font-medium transition-all w-full sm:w-auto" onClick={()=>navigate(`/addcourses/${courseId}`)}>
            <FaArrowLeft /> Back to Course
          </button>
          <button className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all font-bold w-full sm:w-auto" disabled={loading} onClick={createLectureHandler}>
           {loading?<ClipLoader size={20} color='black'/>: "+ Create Lecture"}
          </button>
        </div>

        {/* Lecture List */}
         <div>
          <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
            <span className="text-orange-500">📚</span> Existing Lectures
          </h2>
          {lectureData.length === 0 ? (
             <div className="text-center bg-[#0a0a12] p-8 rounded-2xl border border-white/5 text-gray-500 text-sm">
                No lectures created for this course yet.
             </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {lectureData.map((lecture, index) => (
                <div key={index} className="bg-[#0a0a12] border border-white/5 rounded-2xl flex justify-between items-center p-4 text-sm font-medium hover:bg-white/5 hover:border-white/10 transition-colors group">
                  <span className="text-gray-300">
                     <span className="text-orange-400 font-bold mr-2">{(index + 1).toString().padStart(2, '0')}</span> 
                     {lecture.lectureTitle}
                  </span>
                  <button 
                    className="p-2 bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 rounded-lg transition-colors text-gray-500"
                    onClick={()=>navigate(`/editlecture/${courseId}/${lecture._id}`)}
                  >
                    <FaEdit />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div> 
      </div>
    </div>
  )
}

export default CreateLecture
