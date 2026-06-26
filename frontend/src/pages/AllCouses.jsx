import React, { useEffect, useState } from 'react';
import Card from "../components/Card.jsx";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import ai from '../assets/SearchAi.png'
import { useSelector, useDispatch } from 'react-redux';
import { ClipLoader } from 'react-spinners';
function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [category, setCategory] = useState([])
  const [filterCourses, setFilterCourses] = useState([])
  const { courseData } = useSelector(state => state.course)
  const [isLoading, setIsLoading] = useState(false)



  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let courseCopy = courseData ? courseData.slice() : [];

    if (category.length > 0) {
      courseCopy = courseCopy.filter(item => category.includes(item.category))
    }

    setFilterCourses(courseCopy)
  }

  // Fetch fresh data when landing on page instead of relying only on App load
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        import('axios').then(async (axios) => {
           const { serverUrl } = await import('../App.jsx');
           const { setCourseData } = await import('../redux/courseSlice.js');
           const result = await axios.default.get(serverUrl + "/api/course/getpublishedcoures", { withCredentials: true });
           dispatch(setCourseData(result.data));
           setIsLoading(false);
        });
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [dispatch]);

  useEffect(() => {
    applyFilter();
  }, [courseData, category])

  return (
    <div className="min-h-screen bg-[#05050a] relative">
      {/* ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[420px] h-[420px] bg-orange-400/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Page header (replaces Nav) */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5 border-b border-orange-500/10 bg-[#05050a]/80 backdrop-blur-md sticky top-0">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 text-gray-100 hover:text-orange-300 transition group"
        >
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-105 transition">
            <FaArrowLeftLong className="text-black text-sm" />
          </span>
          <span className="text-lg font-semibold">
            All <span className="text-orange-400">Courses</span>
          </span>
        </button>

        <p className="hidden sm:block text-sm text-gray-400">
          {filterCourses?.length || 0} course{filterCourses?.length === 1 ? '' : 's'} found
        </p>
      </header>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarVisible(prev => !prev)}
        className="fixed top-24 left-4 z-50 bg-[#0c0c14] text-orange-400 px-3 py-1 rounded-md md:hidden border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
      >
        {isSidebarVisible ? 'Hide' : 'Show'} Filters
      </button>

      <div className="relative z-[1] flex">
        {/* Sidebar */}
        <aside className={`w-[260px] min-h-[calc(100vh-73px)] overflow-y-auto bg-[#0a0a12] fixed top-[73px] left-0 p-6 py-10 border-r border-orange-500/10 shadow-[4px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 z-10
          ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}>

          <h2 className="text-lg font-bold text-gray-100 mb-6">Filter by Category</h2>

          <form className="space-y-4 text-sm bg-[#0f0f18] border border-orange-500/15 text-gray-200 p-[20px] rounded-2xl shadow-[0_0_25px_rgba(249,115,22,0.06)]" onSubmit={(e) => e.preventDefault()}>
            <button
              className='w-full px-[10px] py-[10px] bg-gradient-to-r from-orange-500 to-amber-400 text-black rounded-[10px] text-[15px] font-semibold flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 transition shadow-[0_0_20px_rgba(249,115,22,0.35)]'
              onClick={() => navigate("/searchwithai")}
            >
              Search with AI <img src={ai} className='w-[30px] h-[30px] rounded-full' alt="" />
            </button>
            <label className="flex items-center gap-3 cursor-pointer hover:text-orange-300 transition">
              <input type="checkbox" className="accent-orange-500 w-4 h-4 rounded-md" value={'App Development'} onChange={toggleCategory} />
              App Development
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-orange-300 transition">
              <input type="checkbox" className="accent-orange-500 w-4 h-4 rounded-md" value={'AI/ML'} onChange={toggleCategory} />
              AI/ML
            </label>

            <label className="flex items-center gap-3 cursor-pointer hover:text-orange-300 transition">
              <input type="checkbox" className="accent-orange-500 w-4 h-4 rounded-md" value={'AI Tools'} onChange={toggleCategory} />
              AI Tools
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-orange-300 transition">
              <input type="checkbox" className="accent-orange-500 w-4 h-4 rounded-md" value={'Data Science'} onChange={toggleCategory} />
              Data Science
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-orange-300 transition">
              <input type="checkbox" className="accent-orange-500 w-4 h-4 rounded-md" value={'Data Analytics'} onChange={toggleCategory} />
              Data Analytics
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-orange-300 transition">
              <input type="checkbox" className="accent-orange-500 w-4 h-4 rounded-md" value={'Ethical Hacking'} onChange={toggleCategory} />
              Ethical Hacking
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-orange-300 transition">
              <input type="checkbox" className="accent-orange-500 w-4 h-4 rounded-md" value={'UI UX Designing'} onChange={toggleCategory} />
              UI UX Designing
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-orange-300 transition">
              <input type="checkbox" className="accent-orange-500 w-4 h-4 rounded-md" value={'Web Development'} onChange={toggleCategory} />
              Web Development
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:text-orange-300 transition">
              <input type="checkbox" className="accent-orange-500 w-4 h-4 rounded-md" value={'Others'} onChange={toggleCategory} />
              Others
            </label>
          </form>
        </aside>

        {/* Main Courses Section */}
        <main className="w-full transition-all duration-300 py-10 md:pl-[300px] flex items-start justify-center md:justify-start flex-wrap gap-6 px-[10px]">
          {isLoading ? (
             <div className="flex justify-center items-center w-full mt-20">
               <ClipLoader size={50} color='orange' />
             </div>
          ) : (
            filterCourses?.map((item, index) => (
              <Card key={item._id || index} thumbnail={item.thumbnail} title={item.title} price={item.price} category={item.category} id={item._id} reviews={item.reviews} />
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export default AllCourses;