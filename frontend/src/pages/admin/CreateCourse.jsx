import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
const CreateCourse = () => {
    let navigate = useNavigate()
    let [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")

    const CreateCourseHandler = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true })
            console.log(result.data)
            toast.success("Course Created")
            navigate("/courses")
            setTitle("")
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response.data.message)
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#05050a] relative px-4 py-10">
            {/* Ambient Backdrops */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[10%] w-[320px] h-[320px] bg-amber-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-xl w-full sm:w-[500px] mx-auto p-8 lg:p-10 bg-[#0c0c14]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl relative z-10">
                <button 
                  onClick={() => navigate("/courses")}
                  className="absolute top-6 left-6 z-20 w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/40 transition group"
                >
                  <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center mt-2">Activate New Course</h2>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Course Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">
                            Course Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter course title"
                            className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder-gray-600"
                            onChange={(e) => setTitle(e.target.value)} value={title}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                className="w-full bg-[#05050a] border border-white/10 text-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all appearance-none cursor-pointer"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="" disabled className="text-gray-600">Select category</option>
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-8 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold px-8 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all transform flex items-center justify-center gap-2" 
                        disabled={loading} onClick={CreateCourseHandler}
                    >
                        {loading ? <ClipLoader size={24} color='black' /> : "Create Course"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
