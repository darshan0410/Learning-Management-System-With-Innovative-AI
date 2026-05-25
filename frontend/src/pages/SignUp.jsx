import React, { useRef, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/Firebase'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { FaBuildingColumns } from "react-icons/fa6";

function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tiltRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = tiltRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateY = ((x - centerX) / centerX) * 10
    const rotateX = -((y - centerY) / centerY) * 10

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`
  }

  const handleMouseLeave = () => {
    const card = tiltRef.current
    if (!card) return
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`
  }

  const handleSignUp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, email, password, role },
        { withCredentials: true }
      )

      dispatch(setUserData(result.data))
      toast.success("SignUp Successfully")
      navigate("/")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      const user = response.user

      const result = await axios.post(
        serverUrl + "/api/auth/googlesignup",
        {
          name: user.displayName,
          email: user.email,
          role
        },
        { withCredentials: true }
      )

      dispatch(setUserData(result.data))
      toast.success("SignUp Successfully")
      navigate("/")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Google signup failed")
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b1020] flex items-center justify-center px-4 py-8">
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle particle1"></div>
        <div className="particle particle2"></div>
        <div className="particle particle3"></div>
        <div className="particle particle4"></div>
        <div className="particle particle5"></div>
        <div className="particle particle6"></div>
        <div className="particle particle7"></div>
        <div className="particle particle8"></div>
        <div className="particle particle9"></div>
        <div className="particle particle10"></div>

        <div className="absolute top-[-100px] left-[-100px] h-80 w-80 rounded-full bg-orange-500/15 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-120px] right-[-100px] h-96 w-96 rounded-full bg-red-500/15 blur-3xl animate-pulse"></div>
        <div className="absolute top-[25%] right-[20%] h-64 w-64 rounded-full bg-pink-500/10 blur-3xl animate-pulse"></div>
      </div>

      <form
        className="relative z-10 w-full max-w-6xl min-h-[650px] rounded-[30px] overflow-hidden border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,0,0,0.5)] flex"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-white/85 backdrop-blur-xl px-6 md:px-10 py-10 flex flex-col justify-center gap-5">
          <div className="text-center md:text-left mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Let&apos;s get Started
            </h1>
            <p className="text-gray-500 mt-2 text-base md:text-lg">
              Create your account with a modern experience
            </p>
          </div>

          {/* Name */}
          <div className="relative w-full max-w-md">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              className="peer w-full h-14 px-4 pt-5 rounded-2xl border border-gray-300 bg-white/80 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 shadow-sm hover:shadow-md"
            />
            <label
              htmlFor="name"
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                nameFocused || name
                  ? "top-2 text-xs text-orange-600 font-semibold"
                  : "top-1/2 -translate-y-1/2 text-gray-500 text-base"
              }`}
            >
              Your Name
            </label>
          </div>

          {/* Email */}
          <div className="relative w-full max-w-md">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="peer w-full h-14 px-4 pt-5 rounded-2xl border border-gray-300 bg-white/80 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 shadow-sm hover:shadow-md"
            />
            <label
              htmlFor="email"
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                emailFocused || email
                  ? "top-2 text-xs text-orange-600 font-semibold"
                  : "top-1/2 -translate-y-1/2 text-gray-500 text-base"
              }`}
            >
              Your Email
            </label>
          </div>

          {/* Password */}
          <div className="relative w-full max-w-md">
            <input
              id="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="peer w-full h-14 px-4 pt-5 pr-12 rounded-2xl border border-gray-300 bg-white/80 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 shadow-sm hover:shadow-md"
            />
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                passwordFocused || password
                  ? "top-2 text-xs text-orange-600 font-semibold"
                  : "top-1/2 -translate-y-1/2 text-gray-500 text-base"
              }`}
            >
              Password
            </label>

            {!show ? (
              <MdOutlineRemoveRedEye
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[22px] text-gray-500 cursor-pointer hover:text-black transition"
                onClick={() => setShow(true)}
              />
            ) : (
              <MdRemoveRedEye
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[22px] text-gray-700 cursor-pointer hover:text-black transition"
                onClick={() => setShow(false)}
              />
            )}
          </div>

          {/* Role */}
          <div className="flex flex-wrap gap-4 pt-1">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                role === "student"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-orange-400"
              }`}
            >
              Student
            </button>

            <button
              type="button"
              onClick={() => setRole("educator")}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                role === "educator"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-orange-400"
              }`}
            >
              Educator
            </button>
          </div>

          {/* Signup button */}
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full max-w-md h-13 rounded-2xl text-white font-semibold text-[17px] flex items-center justify-center shadow-[0_15px_35px_rgba(255,98,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
            style={{ background: "linear-gradient(to right, orange, orangered)" }}
          >
            {loading ? <ClipLoader size={26} color="white" /> : "Sign Up"}
          </button>

          {/* Divider */}
          <div className="w-full max-w-md flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-gray-500 text-sm">Or continue with</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={googleSignUp}
            className="w-full max-w-md h-13 rounded-2xl border border-gray-300 bg-white flex items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2c-2.1 1.6-4.6 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6 7l.1-.1 6.2 5.2C35.2 40.4 44 34 44 24c0-1.3-.1-2.3-.4-3.5z"/>
            </svg>
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>

          <p className="text-gray-600 text-sm md:text-base">
            Already have an account?{" "}
            <span
              className="underline underline-offset-4 text-black font-semibold cursor-pointer hover:text-orange-600 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-8 [perspective:1200px]">
          <div
            ref={tiltRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-full rounded-[28px] border border-white/20 bg-gradient-to-br from-[#1a1f3a] via-[#2b1f44] to-[#3b1d2f] shadow-[0_25px_80px_rgba(0,0,0,0.45)] overflow-hidden transition-transform duration-200 ease-out [transform-style:preserve-3d]"
          >
            {/* decorative lights */}
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-orange-500/25 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-pink-500/20 blur-3xl"></div>
            <div className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-blue-400/20 blur-2xl"></div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8 text-white [transform:translateZ(40px)]">
              <div className="w-28 h-28 rounded-[26px] bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.35)] mb-6 animate-float">
                <FaBuildingColumns className="text-[64px] text-orange-400 drop-shadow-[0_10px_20px_rgba(255,115,0,0.5)] animate-pulse" />
              </div>

              <h2 className="text-4xl font-extrabold tracking-[4px] drop-shadow-lg">
                CODE STUDIO
              </h2>

              <p className="mt-5 text-gray-200 leading-7 max-w-md text-[17px]">
                Build skills, create projects, and learn with a beautiful modern platform made for future developers.
              </p>

              <div className="mt-8 flex gap-3 flex-wrap justify-center">
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-sm">
                  Interactive Learning
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-sm">
                  Smart Courses
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-sm">
                  Creative UI
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        .particle {
          position: absolute;
          border-radius: 9999px;
          background: rgba(255,255,255,0.10);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .particle1 { width: 8px; height: 8px; left: 10%; top: 90%; animation: floatUp 11s infinite; }
        .particle2 { width: 12px; height: 12px; left: 18%; top: 100%; animation: floatUp 15s infinite 1s; }
        .particle3 { width: 6px; height: 6px; left: 28%; top: 95%; animation: floatUp 9s infinite 2s; }
        .particle4 { width: 10px; height: 10px; left: 40%; top: 100%; animation: floatUp 13s infinite 1.5s; }
        .particle5 { width: 14px; height: 14px; left: 55%; top: 92%; animation: floatUp 16s infinite 0.5s; }
        .particle6 { width: 9px; height: 9px; left: 68%; top: 100%; animation: floatUp 12s infinite 2.5s; }
        .particle7 { width: 7px; height: 7px; left: 78%; top: 96%; animation: floatUp 10s infinite 1s; }
        .particle8 { width: 11px; height: 11px; left: 86%; top: 100%; animation: floatUp 14s infinite 3s; }
        .particle9 { width: 5px; height: 5px; left: 92%; top: 94%; animation: floatUp 8s infinite 1.5s; }
        .particle10 { width: 13px; height: 13px; left: 50%; top: 98%; animation: floatUp 17s infinite 2s; }

        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-50vh) translateX(30px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(-20px);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default SignUp