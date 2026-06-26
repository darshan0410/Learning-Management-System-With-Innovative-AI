import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

function EditProfile() {
     let {userData} = useSelector(state=>state.user)
     let [name,setName] = useState(userData.name || "")
     let [description,setDescription] = useState(userData.description || "")
     let [photoUrl,setPhotoUrl] = useState(null)
     let dispatch = useDispatch()
     let [loading,setLoading] = useState(false)
     let navigate = useNavigate()

      const formData = new FormData()
      formData.append("name",name)
      formData.append("description",description)
      formData.append("photoUrl",photoUrl)



     const updateProfile = async () => {
      setLoading(true)
      try {
        const result = await axios.post(serverUrl + "/api/user/updateprofile" ,formData , {withCredentials:true} )
        console.log(result.data)
        dispatch(setUserData(result.data))
        navigate("/")
        setLoading(false)
      
        toast.success("Profile Update Successfully")
        

        
      } catch (error) {
        console.log(error)
        toast.error("Profile Update Error")
        setLoading(false)
      }
      
     }
  return (
    <div className="min-h-screen bg-[#05050a] relative flex items-center justify-center p-4">
      {/* ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-[#0c0c14]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl p-8 md:p-10 max-w-xl w-full relative z-10">
        <button 
          onClick={()=>navigate("/profile")}
          className="absolute top-6 left-6 md:top-8 md:left-8 w-10 h-10 rounded-xl bg-[#0f0f18] border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/40 transition group"
        >
          <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-100 mb-8 mt-2">Edit Profile</h2>

        <form  className="space-y-6" onSubmit={(e)=>e.preventDefault()}>
          {/* Profile Photo */}
           <div className="flex flex-col items-center text-center">
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
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Select Avatar</label>
            <div className="relative">
                <input
                  type="file"
                  name="photoUrl"
                  className="w-full bg-[#05050a] border border-white/10 rounded-xl p-2 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all text-gray-400 cursor-pointer"
                  onChange={(e)=>setPhotoUrl(e.target.files[0])}
                />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder-gray-600"
              placeholder={userData.name}
              onChange={(e)=>setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Email</label>
            <input
              type="email"
              readOnly
              className="w-full bg-white/5 border border-white/5 text-gray-500 px-4 py-3.5 rounded-xl outline-none cursor-not-allowed"
              placeholder={userData.email}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Description</label>
            <textarea
              name="description"
              className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder-gray-600 resize-none h-32"
              placeholder="Tell us about yourself"
              onChange={(e)=>setDescription(e.target.value)}
              value={description}
            />
          </div>

          {/* Save Button */}
          <div className="pt-4">
             <button
               type="submit"
               className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2" 
               disabled={loading} onClick={updateProfile}
             >
               {loading ? <ClipLoader size={24} color='black'/> : "Save Changes"}
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
