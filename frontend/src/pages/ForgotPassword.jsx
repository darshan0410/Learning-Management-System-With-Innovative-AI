import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { FaBuildingColumns } from "react-icons/fa6";

function ForgotPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [newpassword, setNewPassword] = useState("")
  const [conPassword, setConpassword] = useState("")

  const [emailFocused, setEmailFocused] = useState(false)
  const [otpFocused, setOtpFocused] = useState(false)
  const [newPasswordFocused, setNewPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)

  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleStep1 = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/sendotp`, { email }, { withCredentials: true })
      setStep(2)
      toast.success(result.data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleStep2 = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verifyotp`, { email, otp }, { withCredentials: true })
      toast.success(result.data.message)
      setStep(3)
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleStep3 = async () => {
    if (newpassword !== conPassword) {
      toast.error("Password does not match")
      return
    }

    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/resetpassword`, { email, password: newpassword }, { withCredentials: true })
      toast.success(result.data.message)
      navigate("/login")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b1020] flex items-center justify-center px-4 py-6">

      {/* Particles */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`particle p${i}`}></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl rounded-[28px] overflow-hidden border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] flex">

        {/* LEFT */}
        <div className="w-full md:w-1/2 bg-white/90 px-6 py-8 flex flex-col justify-center gap-4">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>

              <div className="relative">
                <input
                  type="email"
                  className="w-full h-12 px-4 pt-4 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
                <label className={`absolute left-4 ${emailFocused || email ? "top-1 text-xs text-orange-500" : "top-3 text-gray-500"}`}>
                  Email
                </label>
              </div>

              <button onClick={handleStep1} disabled={loading}
                className="h-11 rounded-xl text-white font-semibold"
                style={{ background: "linear-gradient(to right, orange, orangered)" }}>
                {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Enter OTP</h2>

              <div className="relative">
                <input
                  type="text"
                  className="w-full h-12 px-4 pt-4 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onFocus={() => setOtpFocused(true)}
                  onBlur={() => setOtpFocused(false)}
                />
                <label className={`absolute left-4 ${otpFocused || otp ? "top-1 text-xs text-orange-500" : "top-3 text-gray-500"}`}>
                  OTP
                </label>
              </div>

              <button onClick={handleStep2} disabled={loading}
                className="h-11 rounded-xl text-white font-semibold"
                style={{ background: "linear-gradient(to right, orange, orangered)" }}>
                {loading ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>

              <div className="relative">
                <input type={showNew ? "text" : "password"}
                  className="w-full h-12 px-4 pt-4 rounded-xl border focus:ring-2 focus:ring-orange-400"
                  value={newpassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onFocus={() => setNewPasswordFocused(true)}
                  onBlur={() => setNewPasswordFocused(false)}
                />
                <label className={`absolute left-4 ${newPasswordFocused || newpassword ? "top-1 text-xs text-orange-500" : "top-3 text-gray-500"}`}>
                  New Password
                </label>
              </div>

              <div className="relative">
                <input type={showConfirm ? "text" : "password"}
                  className="w-full h-12 px-4 pt-4 rounded-xl border focus:ring-2 focus:ring-orange-400"
                  value={conPassword}
                  onChange={(e) => setConpassword(e.target.value)}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                />
                <label className={`absolute left-4 ${confirmPasswordFocused || conPassword ? "top-1 text-xs text-orange-500" : "top-3 text-gray-500"}`}>
                  Confirm Password
                </label>
              </div>

              <button onClick={handleStep3} disabled={loading}
                className="h-11 rounded-xl text-white font-semibold"
                style={{ background: "linear-gradient(to right, orange, orangered)" }}>
                {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
              </button>
            </>
          )}

          <span className="text-sm text-gray-600 cursor-pointer mt-2"
            onClick={() => navigate("/login")}>
            Back to Login
          </span>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-5">
          <div className="w-full h-full rounded-[24px] bg-gradient-to-br from-[#1a1f3a] via-[#2b1f44] to-[#3b1d2f] flex flex-col items-center justify-center text-white">

            {/* 🔥 Reduced gap + smaller logo */}
            <FaBuildingColumns className="text-[60px] text-orange-400 mb-3 animate-pulse" />

            <h2 className="text-3xl font-bold tracking-wider">
              CODE STUDIO
            </h2>

            <p className="text-gray-300 text-center mt-3 px-6 text-[15px] leading-6">
              Secure recovery with OTP verification and smooth password reset experience.
            </p>

          </div>
        </div>

      </div>

      <style>{`
        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          animation: floatUp 10s linear infinite;
        }
        @keyframes floatUp {
          0% { transform: translateY(100vh); opacity:0; }
          50% { opacity:1; }
          100% { transform: translateY(-100vh); opacity:0; }
        }
      `}</style>
    </div>
  )
}

export default ForgotPassword