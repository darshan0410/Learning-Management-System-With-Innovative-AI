import React, { useEffect, useRef, useState } from 'react'
import img from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { MdEdit } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { setCourseData } from '../../redux/courseSlice';
function AddCourses() {
    const navigate= useNavigate()
    const {courseId} = useParams()
   
    
    const [selectedCourse,setSelectedCourse] = useState(null)
    const [title,setTitle] = useState("")
    const [subTitle,setSubTitle] = useState("")
    const [description,setDescription] = useState("")
    const [category,setCategory] = useState("")
    const [level,setLevel] = useState("")
    const [price,setPrice] = useState("")
    const [isPublished,setIsPublished] = useState(false)
   const thumb=useRef()
   const [frontendImage,setFrontendImage] = useState(null)
   const [backendImage,setBackendImage] = useState(null)
   let [loading,setLoading] = useState(false)
   const dispatch = useDispatch()
   const {courseData} = useSelector(state=>state.course)



    const getCourseById = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}` , {withCredentials:true})
          setSelectedCourse(result.data)
          console.log(result)
        
      } catch (error) {
        console.log(error)
      }
      
    }
    useEffect(() => {
  if (selectedCourse) {
    setTitle(selectedCourse.title || "")
    setSubTitle(selectedCourse.subTitle || "")
    setDescription(selectedCourse.description || "")
    setCategory(selectedCourse.category || "")
    setLevel(selectedCourse.level || "")
    setPrice(selectedCourse.price || "")
    setFrontendImage(selectedCourse.thumbnail || img)
    setIsPublished(selectedCourse?.isPublished)


  }
}, [selectedCourse])

    useEffect(()=>{
      getCourseById()

    },[])
  const handleThumbnail = (e)=>{
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }


const editCourseHandler = async () => {
  setLoading(true);
  const formData = new FormData();
  formData.append("title", title);
  formData.append("subTitle", subTitle);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("level", level);
  formData.append("price", price);
  formData.append("thumbnail", backendImage);
  formData.append("isPublished", isPublished);

  try {
    const result = await axios.post(
      `${serverUrl}/api/course/editcourse/${courseId}`,
      formData,
      { withCredentials: true }
    );

    const updatedCourse = result.data;
    if (updatedCourse.isPublished) {
      const updatedCourses = courseData.map(c =>
        c._id === courseId ? updatedCourse : c
      );
      if (!courseData.some(c => c._id === courseId)) {
        updatedCourses.push(updatedCourse);
      }
      dispatch(setCourseData(updatedCourses));
    } else {
      const filteredCourses = courseData.filter(c => c._id !== courseId);
      dispatch(setCourseData(filteredCourses));
    }

    navigate("/courses");
    toast.success("Course Updated");
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  const removeCourse = async () => {
    setLoading(true)
    try {
      const result = await axios.delete(serverUrl + `/api/course/removecourse/${courseId}` , {withCredentials:true})
      toast.success("Course Deleted")
       const filteredCourses = courseData.filter(c => c._id !== courseId);
      dispatch(setCourseData(filteredCourses));
      console.log(result)
      navigate("/courses")
      setLoading(false)

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

    
  return (
    <div className="min-h-screen bg-[#05050a] relative p-6 mt-10 md:p-8 lg:p-12">
       {/* Ambient Backdrops */}
       <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[320px] h-[320px] bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
      </div>

     <div className="max-w-5xl mx-auto bg-[#0c0c14]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 md:p-10 relative z-10">
        
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5 relative">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={()=>navigate("/courses")}
            className="w-10 h-10 shrink-0 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/40 transition group"
          >
            <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Course Information</h2>
            <p className="text-sm text-gray-500">Edit metadata and configure access</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-white/10 text-orange-400 px-6 py-2.5 rounded-xl hover:bg-orange-500/10 hover:border-orange-500/30 transition-all font-medium" onClick={()=>navigate(`/createlecture/${selectedCourse?._id}`)}>Configure Lectures</button>
        </div>
      </div>

      {/* Form Box */}
      <div className="bg-[#0a0a12] p-6 md:p-8 rounded-2xl border border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <span className="text-orange-500">⚙</span> Basic Details
          </h3>
          <div className="flex gap-3">
            {!isPublished ? 
              <button className="bg-green-500/10 text-green-400 border border-green-500/20 px-6 py-2 rounded-xl hover:bg-green-500/20 transition-colors font-medium" onClick={()=>setIsPublished(prev=>!prev)}>Publish Course</button> 
            : 
              <button className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-6 py-2 rounded-xl hover:bg-amber-500/20 transition-colors font-medium" onClick={()=>setIsPublished(prev=>!prev)}>Unpublish Course</button>
            }
            <button className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2 rounded-xl hover:bg-red-500/20 transition-colors font-medium flex items-center justify-center w-[160px]" disabled={loading} onClick={removeCourse}>
              {loading ? <ClipLoader size={20} color='currentColor'/> : "Delete Course"}
            </button>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e)=>e.preventDefault()}>
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Title</label>
            <input type="text" placeholder="Course Title" className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder-gray-600" onChange={(e)=>setTitle(e.target.value)} value={title}/>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Subtitle</label>
            <input type="text" placeholder="Engaging descriptive subtitle" className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder-gray-600" onChange={(e)=>setSubTitle(e.target.value)} value={subTitle} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Description</label>
            <textarea placeholder="Extensive course description" className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder-gray-600 h-32 resize-none" onChange={(e)=>setDescription(e.target.value)} value={description}></textarea>
          </div>

          {/* Category, Level, Price - Flex row */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Category */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Category</label>
              <div className="relative">
                <select className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all appearance-none cursor-pointer" onChange={(e)=>setCategory(e.target.value)} value={category}>
                  <option value="" disabled className="text-gray-600">Select Category</option>
                  <option value="App Development" className="bg-[#05050a]">App Development</option>
                  <option value="AI/ML" className="bg-[#05050a]">AI/ML</option>
                  <option value="AI Tools" className="bg-[#05050a]">AI Tools</option>
                  <option value="Data Science" className="bg-[#05050a]">Data Science</option>
                  <option value="Data Analytics" className="bg-[#05050a]">Data Analytics</option>
                  <option value="Ethical Hacking" className="bg-[#05050a]">Ethical Hacking</option>
                  <option value="UI UX Designing" className="bg-[#05050a]">UI UX Designing</option>
                  <option value="Web Development" className="bg-[#05050a]">Web Development</option>
                  <option value="Others" className="bg-[#05050a]">Others</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-500">▼</div>
              </div>
            </div>

            {/* Level */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Course Level</label>
              <div className="relative">
                <select className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all appearance-none cursor-pointer" onChange={(e)=>setLevel(e.target.value)} value={level} >
                  <option value="" disabled className="text-gray-600">Select Level</option>
                  <option value="Beginner" className="bg-[#05050a]">Beginner</option>
                  <option value="Intermediate" className="bg-[#05050a]">Intermediate</option>
                  <option value="Advanced" className="bg-[#05050a]">Advanced</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-500">▼</div>
              </div>
            </div>

            {/* Price */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Price (INR)</label>
              <input type="number" placeholder="₹ 0.00" className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder-gray-600" onChange={(e)=>setPrice(e.target.value)} value={price} />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="pt-4 border-t border-white/5">
            <label className="block text-sm font-semibold text-gray-400 mb-4">Course Thumbnail</label>
            <input type="file" ref={thumb} hidden onChange={handleThumbnail} accept='image/*' />
            
            <div className='relative w-[320px] aspect-video group cursor-pointer overflow-hidden rounded-xl border border-white/10 shadow-xl ring-1 ring-white/5' onClick={()=>thumb.current.click()}>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                <div className="bg-orange-500 text-black p-3 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                   <MdEdit className='w-6 h-6' />
                </div>
              </div>
              <img src={frontendImage} alt="" className='w-full h-full object-cover bg-black' />
            </div>
            <p className="text-xs text-gray-500 mt-3">Click on image to upload a new thumbnail. Recomended size: 1280x720</p>
          </div>

          <div className='flex items-center justify-start gap-4 pt-8'>
            <button className='bg-transparent text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 px-8 py-3 rounded-xl transition-colors font-medium' onClick={()=>navigate("/courses")}>Cancel</button>
            <button className='bg-gradient-to-r from-orange-500 to-amber-500 text-black px-10 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all font-bold flex items-center justify-center min-w-[120px]' disabled={loading} onClick={editCourseHandler}>
              {loading ? <ClipLoader size={24} color='black'/> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}

export default AddCourses
