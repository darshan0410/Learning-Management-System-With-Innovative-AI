import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeftLong } from "react-icons/fa6";
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice';
import { setUserData } from '../redux/userSlice';
import { FaLock, FaPlayCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa6";


function ViewCourse() {

  const { courseId } = useParams();
  const navigate = useNavigate()
  const { courseData } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)
  const [creatorData, setCreatorData] = useState(null)
  const dispatch = useDispatch()
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { lectureData } = useSelector(state => state.lecture)
  const { selectedCourseData } = useSelector(state => state.course)
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");





  const handleReview = async () => {
    try {
      const result = await axios.post(serverUrl + "/api/review/givereview", { rating, comment, courseId }, { withCredentials: true })
      toast.success("Review Added")
      console.log(result.data)
      setRating(0)
      setComment("")

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }


  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1); // rounded to 1 decimal
  };

  // Usage:
  const avgRating = calculateAverageRating(selectedCourseData?.reviews);
  console.log("Average Rating:", avgRating);



  const fetchCourseData = async () => {
    courseData.map((item) => {
      if (item._id === courseId) {
        dispatch(setSelectedCourseData(item))
        console.log(selectedCourseData)


        return null;
      }

    })

  }
  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(c => {
      const enrolledId = typeof c === 'string' ? c : c._id;
      return enrolledId?.toString() === courseId?.toString();
    });

    console.log("Enrollment verified:", verify);
    if (verify) {
      setIsEnrolled(true);
    }
  };
  useEffect(() => {
    fetchCourseData()
    checkEnrollment()
  }, [courseId, courseData, lectureData])


  // Fetch creator info once course data is available
  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/getcreator`,
            { userId: selectedCourseData.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
          console.log(result.data)
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };

    getCreator();


  }, [selectedCourseData]);





  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const creatorCourses = courseData.filter(
        (course) =>
          course.creator === creatorData._id && course._id !== courseId // Exclude current course
      );
      setSelectedCreatorCourse(creatorCourses);

    }
  }, [creatorData, courseData]);


  const handleEnroll = async (courseId, userId) => {
    try {
      // 1. Create Order
      const orderData = await axios.post(serverUrl + "/api/payment/create-order", {
        courseId,
        userId
      }, { withCredentials: true });
      console.log(orderData)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
        amount: orderData.data.amount,
        currency: "INR",
        name: "Virtual Courses",
        description: "Course Enrollment Payment",
        order_id: orderData.data.id,
        handler: async function (response) {
          console.log("Razorpay Response:", response);
          try {
            const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment", {
              ...response,
              courseId,
              userId
            }, { withCredentials: true });

            // Re-fetch user data to populate the enrolledCourses array for React components
            const updatedUserReq = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });
            dispatch(setUserData(updatedUserReq.data));

            setIsEnrolled(true)
            toast.success(verifyRes.data.message);
          } catch (verifyError) {
            toast.error("Payment verification failed.");
            console.error("Verification Error:", verifyError);
          }
        },
      };

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong while enrolling.");
      }
      console.error("Enroll Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050a] relative p-4 md:p-6 lg:p-8">
      {/* ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[420px] h-[420px] bg-orange-400/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto bg-[#0c0c14]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl p-6 lg:p-10 space-y-8 relative z-10">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-8 ">
          {/* Thumbnail */}
          <div className="w-full md:w-1/2 relative group">
            <button 
              onClick={() => navigate("/")}
              className="absolute top-4 left-4 z-20 w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-orange-400 hover:border-orange-500/40 transition-all hover:-translate-x-1"
            >
              <FaArrowLeftLong />
            </button>
            <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative ring-1 ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              {selectedCourseData?.thumbnail ? <img
                src={selectedCourseData?.thumbnail}
                alt="Course Thumbnail"
                className="w-full aspect-[4/3] object-cover"
              /> : <img
                src={img}
                alt="Course Thumbnail"
                className="w-full aspect-[4/3] object-cover"
              />}
              
              <div className="absolute bottom-4 left-4 z-20">
                <span className="px-3 py-1 rounded-full bg-orange-500/80 backdrop-blur text-black text-xs font-bold uppercase tracking-wider">
                  {selectedCourseData?.category}
                </span>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="flex-1 space-y-4 flex flex-col justify-center">
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 leading-tight">{selectedCourseData?.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed">{selectedCourseData?.subTitle}</p>

            {/* Rating & Price */}
            <div className="flex items-start flex-col gap-3 py-4 border-y border-white/5">
              <div className="flex items-center gap-2">
                 <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(avgRating) ? "text-yellow-500" : "text-gray-700"} />
                    ))}
                 </div>
                 <span className="text-gray-200 font-bold">{avgRating}</span>
                 <span className="text-gray-500 text-sm">(1,200 reviews)</span>
              </div>
              <div className="flex items-end gap-3 mt-1">
                <span className="text-3xl font-bold text-orange-400">₹{selectedCourseData?.price}</span>{" "}
                <span className="line-through text-lg text-gray-600 mb-1">₹{selectedCourseData?.price ? Number(selectedCourseData.price) * 2 : 599}</span>
              </div>
            </div>

            {/* Highlights */}
            <ul className="text-sm font-medium text-gray-300 space-y-2 pt-2">
              <li className="flex items-center gap-2"><span className="text-orange-500 text-lg">✅</span> 10+ hours of premium video content</li>
              <li className="flex items-center gap-2"><span className="text-orange-500 text-lg">✅</span> Lifetime access & free updates</li>
              <li className="flex items-center gap-2"><span className="text-orange-500 text-lg">✅</span> Certificate of completion</li>
            </ul>

            {/* Enroll Button */}
            <div className="pt-4">
              {!isEnrolled ? (
                <button 
                  className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold px-8 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all transform flex items-center justify-center gap-2" 
                  onClick={() => handleEnroll(courseId, userData._id)}
                >
                  <FaLock className="text-black/70" /> Enroll Now
                </button>
              ) : (
                <button 
                  className="w-full md:w-auto bg-white/10 text-orange-400 border border-orange-500/30 px-8 py-3.5 rounded-xl hover:bg-orange-500/10 hover:border-orange-500/60 transition-all font-bold flex items-center justify-center gap-2" 
                  onClick={() => navigate(`/viewlecture/${courseId}`)}
                >
                  <FaPlayCircle /> Go to Course 
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5 pt-8">
           
           <div className="md:col-span-2 space-y-8">
              {/* What You'll Learn */}
              <div className="bg-[#0a0a12] p-6 rounded-2xl border border-white/5">
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2"><span className="text-orange-500">🎯</span> What You’ll Learn</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-400 text-sm">
                  <li className="flex items-start gap-2"><span className="text-orange-500">✓</span> Master {selectedCourseData?.category} from beginning to end</li>
                  <li className="flex items-start gap-2"><span className="text-orange-500">✓</span> Build real-world portfolio projects</li>
                  <li className="flex items-start gap-2"><span className="text-orange-500">✓</span> Understand complex architectural patterns</li>
                  <li className="flex items-start gap-2"><span className="text-orange-500">✓</span> Best practices and modern industry workflows</li>
                </ul>
              </div>

              {/* Course Description */}
              <div className="bg-[#0a0a12] p-6 rounded-2xl border border-white/5 overflow-hidden w-full">
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2"><span className="text-orange-500">📝</span> About This Course</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words w-full">
                  {selectedCourseData?.description || "No description provided for this course yet."}
                </p>
              </div>

              {/* Course Curriculum Preview */}
              <div>
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2"><span className="text-orange-500">📚</span> Course Curriculum</h2>
                <div className="bg-[#0a0a12] rounded-2xl border border-white/5 overflow-hidden">
                   <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-300">{selectedCourseData?.lectures?.length || 0} Lectures</span>
                      <span className="text-xs text-orange-400 font-medium bg-orange-500/10 px-2 py-1 rounded">Preview Available</span>
                   </div>
                   <div className="flex flex-col">
                    {selectedCourseData?.lectures?.filter(l => isEnrolled || l.isPreviewFree).slice(0, 5).map((lecture, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-5 py-4 border-b last:border-b-0 border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <span className={`text-lg ${lecture.isPreviewFree ? 'text-orange-400' : 'text-gray-600'}`}>
                          {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                        </span>
                        <span className={`text-sm font-medium ${lecture.isPreviewFree ? 'text-gray-200' : 'text-gray-500'}`}>
                          {lecture.lectureTitle}
                        </span>
                        {lecture.isPreviewFree && <span className="ml-auto text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded cursor-pointer" onClick={() => navigate(`/viewlecture/${courseId}`)}>Preview</span>}
                      </div>
                    ))}
                    {(selectedCourseData?.lectures?.filter(l => isEnrolled || l.isPreviewFree).length > 5) && (
                       <div className="p-4 text-center text-sm font-medium text-gray-500 italic bg-black/20">
                          ...and {selectedCourseData.lectures.filter(l => isEnrolled || l.isPreviewFree).length - 5} more lectures!
                       </div>
                    )}
                    {!isEnrolled && selectedCourseData?.lectures?.filter(l => l.isPreviewFree).length === 0 && (
                       <div className="p-4 text-center text-sm font-medium text-gray-500 italic bg-black/20">
                          Enroll to unlock the full curriculum!
                       </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="border-t border-white/5 pt-8">
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2"><span className="text-orange-500">⭐</span> Leave a Review</h2>
                <div className="bg-[#0a0a12] p-6 rounded-2xl border border-white/5">
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star}
                        onClick={() => setRating(star)} 
                        className={`text-2xl cursor-pointer transition-colors ${star <= rating ? "text-yellow-500 hover:text-yellow-400" : "text-gray-700 hover:text-gray-500"}`} 
                      />
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you thought about this course..."
                    className="w-full bg-[#05050a] border border-white/10 text-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder-gray-600"
                    rows="3"
                  />
                  <button
                    className="mt-4 bg-white/10 text-gray-300 font-semibold px-6 py-2.5 rounded-lg border border-white/10 hover:bg-orange-500/20 hover:text-orange-300 hover:border-orange-500/30 transition-all" 
                    onClick={handleReview}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
           </div>

           {/* Right Sidebar Stats & Instructor */}
           <div className="space-y-6">
              
              <div className="bg-gradient-to-br from-[#0a0a12] to-black p-6 rounded-2xl border border-white/5">
                <h2 className="text-lg font-bold text-gray-100 mb-2">Requirements</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">Basic computer skills and an eagerness to learn. No prior experience is strictly mandatory.</p>
                
                <h2 className="text-lg font-bold text-gray-100 mb-2">Target Audience</h2>
                <p className="text-gray-500 text-sm leading-relaxed">Beginners, aspiring professionals, and anyone looking to upgrade their structural skillset.</p>
              </div>

              {/* Instructor Info */}
              <div className="bg-[#0a0a12] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[40px] group-hover:bg-orange-500/10 transition-colors"></div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Course Instructor</h3>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={creatorData?.photoUrl || img}
                    alt="Instructor"
                    className="w-24 h-24 rounded-full object-cover border-2 border-white/10 shadow-xl mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-100">{creatorData?.name || "Loading..."}</h3>
                  <p className="text-sm font-medium text-orange-400 mb-3">{creatorData?.email}</p>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {creatorData?.description || "A dedicated educator passionate about teaching modern skills."}
                  </p>
                </div>
              </div>

           </div>
        </div>

        {/* Other Courses */}
        {selectedCreatorCourse && selectedCreatorCourse.length > 0 && (
          <div className="border-t border-white/5 pt-10 mt-10">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">More from <span className="text-orange-400">{creatorData?.name}</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedCreatorCourse?.map((item, index) => (
                <Card key={index} thumbnail={item.thumbnail} title={item.title} id={item._id} price={item.price} category={item.category} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewCourse
