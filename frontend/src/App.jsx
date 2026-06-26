import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword'
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/admin/Dashboard'
import Courses from './pages/admin/Courses'
import AllCouses from './pages/AllCouses'
import AddCourses from './pages/admin/AddCourses'
import CreateCourse from './pages/admin/CreateCourse'
import CreateLecture from './pages/admin/CreateLecture'
import EditLecture from './pages/admin/EditLecture'
import getCouseData from './customHooks/getCouseData'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './components/ScrollToTop'
import getCreatorCourseData from './customHooks/getCreatorCourseData'
import EnrolledCourse from './pages/EnrolledCourse'
import ViewLecture from './pages/ViewLecture'
import SearchWithAi from './pages/SearchWithAi'
import getAllReviews from './customHooks/getAllReviews'
import AITutor from './components/AiTutor/AITutor'
import HomePage from './components/MockInterview/HomePage';
import InterviewPage from './components/MockInterview/InterviewPage';
import HistoryPage from './components/MockInterview/HistoryPage';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import AiQuiz from './pages/AiQuiz';



export const serverUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function App() {

  let { userData } = useSelector(state => state.user)

  const location = useLocation();

  // ❌ Routes where chatbot should NOT appear
  const hideChatbotRoutes = ["/login", "/signup"];

  getCurrentUser()
  getCouseData()
  getCreatorCourseData()
  getAllReviews()

  return (
    <>
      <ToastContainer />
      <ScrollToTop />

      {/* ✅ Conditional Chatbot */}
      {!hideChatbotRoutes.includes(location.pathname) && <AITutor />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to={"/signup"} />} />
        <Route path='/allcourses' element={userData ? <AllCouses /> : <Navigate to={"/signup"} />} />
        <Route path='/viewcourse/:courseId' element={userData ? <ViewCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={"/signup"} />} />
        <Route path='/enrolledcourses' element={userData ? <EnrolledCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/searchwithai' element={userData ? <SearchWithAi /> : <Navigate to={"/signup"} />} />

        <Route path='/dashboard' element={userData?.role === "educator" ? <Dashboard /> : <Navigate to={"/signup"} />} />
        <Route path='/courses' element={userData?.role === "educator" ? <Courses /> : <Navigate to={"/signup"} />} />
        <Route path='/addcourses/:courseId' element={userData?.role === "educator" ? <AddCourses /> : <Navigate to={"/signup"} />} />
        <Route path='/createcourses' element={userData?.role === "educator" ? <CreateCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/createlecture/:courseId' element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator" ? <EditLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />

        <Route path="/mockinterview" element={userData ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path="/mockinterview/interview" element={userData ? <InterviewPage /> : <Navigate to={"/login"} />} />
        <Route path="/mockinterview/history" element={userData ? <HistoryPage /> : <Navigate to={"/login"} />} />
        <Route path="/resume-analyzer" element={userData ? <ResumeAnalyzer /> : <Navigate to={"/login"} />} />
        <Route path="/aiquiz" element={userData ? <AiQuiz /> : <Navigate to={"/login"} />} />
      </Routes>
    </>
  )
}

export default App