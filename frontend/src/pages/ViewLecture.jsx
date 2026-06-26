import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle, FaLock } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from 'react-toastify';

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const {userData} = useSelector((state) => state.user)
  const selectedCourse = courseData?.find((course) => course._id === courseId);

  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );
  const navigate = useNavigate()
  const courseCreator = userData?._id === selectedCourse?.creator ? userData : null;

  const isEnrolled = userData?.enrolledCourses?.some(c => {
    const enrolledId = typeof c === 'string' ? c : c._id;
    return enrolledId?.toString() === courseId?.toString();
  }) || !!courseCreator;

  // Make sure the initially selected lecture is one they have access to. 
  // If they aren't enrolled, find the first free preview lecture.
  React.useEffect(() => {
    if (selectedCourse?.lectures?.length > 0) {
      if (isEnrolled) {
        setSelectedLecture(selectedCourse.lectures[0]);
      } else {
        const firstFree = selectedCourse.lectures.find(l => l.isPreviewFree);
        setSelectedLecture(firstFree || null); // Note: it will be null if no free lectures
      }
    }
  }, [selectedCourse, isEnrolled]);

  const handleSelectLecture = (lecture) => {
    if (!isEnrolled && !lecture.isPreviewFree) {
      toast.error("Please enroll in this course to view this lecture.");
      return;
    }
    setSelectedLecture(lecture);
  }


  return (
    <div className="min-h-screen bg-[#05050a] relative p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
      
      {/* ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[420px] h-[420px] bg-orange-400/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Left - Video & Course Info */}
      <div className="w-full md:w-2/3 bg-[#0c0c14]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-5 md:p-8 border border-white/5 relative z-10 flex flex-col h-fit">
        {/* Course Details Header */}
        <div className="mb-6 flex items-start gap-4" >
          <button 
            onClick={()=>navigate("/enrolledcourses")}
            className="w-10 h-10 shrink-0 mt-1 rounded-xl bg-[#0f0f18] border border-orange-500/20 flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/40 transition group"
          >
            <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100 tracking-tight leading-tight">{selectedCourse?.title}</h1>
            <div className="mt-3 flex items-center gap-3 text-sm font-medium">
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">{selectedCourse?.category}</span>
              <span className="flex items-center gap-1.5 text-gray-400"><span className="text-lg">🎓</span> {selectedCourse?.level}</span>
            </div>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6 border border-white/10 ring-1 ring-white/5 relative shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          {selectedLecture?.videoUrl ? (
            <video
              src={selectedLecture.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
              crossOrigin="anonymous"
              controlsList="nodownload"
            />
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center h-full text-gray-400">
               {!isEnrolled ? (
                 <>
                   <FaLock className="text-5xl text-gray-700" />
                   <p className="text-lg">Enroll to unlock video lectures</p>
                 </>
               ) : (
                 <>
                   <FaPlayCircle className="text-5xl text-gray-700" />
                   <p className="text-lg">Select a lecture to start watching</p>
                 </>
               )}
            </div>
          )}
        </div>

        {/* Selected Lecture Info Below Video */}
        <div className="mt-2 bg-[#0a0a12] p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
               <FaPlayCircle className="text-lg" />
             </div>
             <div>
               <p className="text-sm font-medium text-orange-500 mb-0.5">Currently Playing</p>
               <h2 className="text-lg font-bold text-gray-100 leading-tight">{selectedLecture?.lectureTitle || "No Lecture Selected"}</h2>
             </div>
          </div>
        </div>
      </div>

      {/* Right - All Lectures + Creator Info */}
      <div className="w-full md:w-1/3 bg-[#0c0c14]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col border border-white/5 relative z-10 h-fit max-h-[calc(100vh-4rem)]">
        
        <div className="p-6 border-b border-white/5">
           <h2 className="text-xl font-bold flex items-center gap-2 text-gray-100"><span className="text-orange-400">☰</span> Course Content</h2>
           <p className="text-sm text-gray-500 mt-1">{selectedCourse?.lectures?.length || 0} Lectures Available</p>
        </div>

        <div className="flex flex-col overflow-y-auto p-4 gap-2 custom-scrollbar flex-1">
          {selectedCourse?.lectures?.length > 0 ? (
            selectedCourse.lectures.map((lecture, index) => {
              const isActive = selectedLecture?._id === lecture._id;
              const isLocked = !isEnrolled && !lecture.isPreviewFree;
              
              return (
                <button
                  key={index}
                  onClick={() => handleSelectLecture(lecture)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 text-left border ${
                    isActive
                      ? 'bg-orange-500/10 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                      : isLocked
                        ? 'bg-[#0a0a12] border-white/5 opacity-60 cursor-not-allowed hover:opacity-80'
                        : 'bg-[#0a0a12] border-white/5 hover:border-white/15 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                     <span className={`text-sm font-bold mt-0.5 ${isActive ? 'text-orange-400' : 'text-gray-600'}`}>
                       {(index + 1).toString().padStart(2, '0')}
                     </span>
                     <h4 className={`text-sm font-semibold leading-snug ${isActive ? 'text-orange-100' : 'text-gray-300'}`}>
                       {lecture.lectureTitle}
                     </h4>
                  </div>
                  {isLocked 
                    ? <FaLock className={`text-lg ml-4 shrink-0 transition-colors text-gray-600`} />
                    : <FaPlayCircle className={`text-xl ml-4 shrink-0 transition-colors ${isActive ? 'text-orange-400' : 'text-gray-500'}`} />
                  }
                </button>
              );
            })
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">No lectures have been uploaded yet.</p>
            </div>
          )}
        </div>

        {/* Creator Info Footer */}
        {courseCreator && (
          <div className="p-5 border-t border-white/5 bg-black/20 rounded-b-3xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Course Instructor</h3>
            <div className="flex items-center gap-4">
              <img
                src={courseCreator.photoUrl || 'https://via.placeholder.com/150'}
                alt="Instructor"
                className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-lg"
              />
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-bold text-gray-200 truncate">{courseCreator.name}</h4>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {courseCreator.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewLecture;
