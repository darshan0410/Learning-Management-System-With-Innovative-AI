import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.jpg";
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import { FaBuildingColumns } from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useNavigate, useLocation } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Nav() {
  const [showHam, setShowHam] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const navRef = useRef(null);
  const brandRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ["home", "about", "work", "contact"];
      let current = "home";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop - 140;
          const bottom = top + section.offsetHeight;
          if (window.scrollY >= top && window.scrollY < bottom) {
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowPro(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", handleClickOutside);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success("LogOut Successfully");
      setShowHam(false);
      setShowPro(false);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const handleMouseMove = (e, ref) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -8;
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTilt = (ref) => {
    if (!ref.current) return;
    ref.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  const scrollToSection = (id) => {
    setShowHam(false);
    setShowPro(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 250);
      return;
    }

    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const gradientText =
    "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-100";

  const desktopBtn =
    "group relative overflow-hidden px-5 py-2.5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl transition-all duration-500 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:scale-[1.05] hover:border-orange-300/40 hover:bg-white/10";

  const mobileBtn =
    "group relative w-[230px] overflow-hidden flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl transition-all duration-500 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:scale-[1.04] hover:border-orange-300/40 hover:bg-white/10";

  const renderDesktopButton = (label, onClick, isActive = false) => (
    <button
      type="button"
      onClick={onClick}
      className={`${desktopBtn} ${
        isActive
          ? "border-orange-300/40 shadow-[0_0_25px_rgba(255,140,0,0.18)]"
          : ""
      }`}
    >
      <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 transition-transform duration-500 ease-out group-hover:translate-y-0 opacity-90" />
      <span className="absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 bg-orange-400/20" />
      <span
        className={`relative z-10 font-semibold tracking-[0.04em] transition-colors duration-500 ${
          isActive ? "text-white" : gradientText
        } group-hover:text-black`}
      >
        {label}
      </span>
    </button>
  );

  const renderMobileButton = (label, onClick) => (
    <button type="button" onClick={onClick} className={mobileBtn}>
      <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 transition-transform duration-500 group-hover:translate-y-0 opacity-90" />
      <span className="relative z-10 text-[18px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-100 group-hover:text-black transition-colors duration-500">
        {label}
      </span>
    </button>
  );

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes navPulse {
          0%, 100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.08);
          }
        }

        @keyframes floatGlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes shimmerMove {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        .nav-orb {
          animation: navPulse 4s ease-in-out infinite;
        }

        .brand-float {
          animation: floatGlow 3.2s ease-in-out infinite;
        }

        .shimmer-line {
          animation: shimmerMove 4.5s linear infinite;
        }
      `}</style>

      {/* MAIN WRAPPER - NOT FIXED */}
      <div className="w-full px-4 lg:px-8 pt-4 relative z-50">
        <div
          ref={navRef}
          onMouseMove={(e) => handleMouseMove(e, navRef)}
          onMouseLeave={() => resetTilt(navRef)}
          className={`relative mx-auto flex h-[78px] w-full items-center justify-between overflow-visible rounded-[24px] border px-4 lg:px-8 transition-all duration-500 ${
            isScrolled
              ? "border-orange-300/20 bg-black/50 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
              : "border-white/10 bg-black/30 shadow-[0_10px_35px_rgba(0,0,0,0.22)] backdrop-blur-xl"
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glow */}
          <div className="nav-orb absolute -left-10 top-[-20px] h-24 w-24 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="nav-orb absolute right-10 top-[-25px] h-20 w-20 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-[1px] overflow-hidden rounded-full">
            <div className="shimmer-line h-full w-1/3 bg-gradient-to-r from-transparent via-orange-300/80 to-transparent" />
          </div>

          {/* Logo + Brand */}
          <div
            ref={brandRef}
            onMouseMove={(e) => handleMouseMove(e, brandRef)}
            onMouseLeave={() => resetTilt(brandRef)}
            onClick={() => scrollToSection("home")}
            className="brand-float flex items-center gap-3 lg:gap-4 cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-orange-500/25 blur-xl" />
              <img
                src={logo}
                alt="CodeStudio Logo"
                className="relative h-[54px] w-[54px] rounded-2xl border border-white/20 object-cover shadow-[0_0_22px_rgba(255,140,0,0.25)] transition-all duration-500 hover:scale-110"
              />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-[0.45em] text-white/50">
                My LMS
              </span>

              <div className="flex items-center gap-2">
                <FaBuildingColumns className="text-orange-400 text-[19px] drop-shadow-[0_0_12px_rgba(255,140,0,0.5)]" />
                <span className="text-[22px] lg:text-[26px] font-black tracking-wide text-white">
                  Code
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-100">
                    Studio
                  </span>
                </span>
                <HiOutlineSparkles className="text-orange-300 text-[17px] drop-shadow-[0_0_10px_rgba(255,170,0,0.7)]" />
              </div>
            </div>
          </div>

          {/* Desktop center buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {renderDesktopButton(
              "About",
              () => scrollToSection("about"),
              activeSection === "about"
            )}
            {renderDesktopButton(
              "Work",
              () => scrollToSection("work"),
              activeSection === "work"
            )}
            {renderDesktopButton(
              "Contact Us",
              () => scrollToSection("contact"),
              activeSection === "contact"
            )}
          </div>

          {/* Desktop right */}
          <div
            ref={profileRef}
            className="hidden lg:flex items-center gap-4 relative"
          >
            {/* Functional Profile Button */}
            {!userData ? (
              <button
                type="button"
                onClick={() => setShowPro((prev) => !prev)}
                className="group relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:border-orange-300/40 hover:shadow-[0_0_25px_rgba(255,140,0,0.2)]"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <IoMdPerson className="relative z-10 h-[24px] w-[24px] fill-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowPro((prev) => !prev)}
                className="relative flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:border-orange-300/40 hover:shadow-[0_0_25px_rgba(255,140,0,0.2)]"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
                {userData?.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    className="relative z-10 h-full w-full rounded-full object-cover"
                    alt="User"
                  />
                ) : (
                  <span className="relative z-10 text-[20px] font-bold">
                    {userData?.name?.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </button>
            )}

            {userData?.role === "educator" &&
              renderDesktopButton("Dashboard", () => navigate("/dashboard"))}

            {!userData
              ? renderDesktopButton("Login", () => navigate("/login"))
              : renderDesktopButton("LogOut", handleLogout)}

            {/* Dropdown */}
            <div
              className={`absolute top-[118%] right-0 min-w-[230px] rounded-[24px] border border-white/15 bg-black/50 p-4 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] transition-all duration-500 ${
                showPro
                  ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                  : "opacity-0 -translate-y-3 scale-95 pointer-events-none"
              }`}
            >
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-orange-500/10 via-transparent to-cyan-400/5" />

              <div className="relative z-10 flex flex-col gap-3">
                {!userData ? (
                  <>
                    {renderDesktopButton("Login", () => {
                      navigate("/login");
                      setShowPro(false);
                    })}
                    {renderDesktopButton("Signup", () => {
                      navigate("/signup");
                      setShowPro(false);
                    })}
                  </>
                ) : (
                  <>
                    {renderDesktopButton("My Profile", () => {
                      navigate("/profile");
                      setShowPro(false);
                    })}
                    {renderDesktopButton("My Courses", () => {
                      navigate("/enrolledcourses");
                      setShowPro(false);
                    })}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setShowHam(true)}
            className="lg:hidden flex h-[48px] w-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-orange-300/40"
          >
            <GiHamburgerMenu className="h-[24px] w-[24px] fill-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${
          showHam
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-2xl transition-all duration-500 ${
            showHam ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute top-[-40px] left-[-20px] h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute bottom-[-30px] right-[-10px] h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

          <button
            type="button"
            onClick={() => setShowHam(false)}
            className="absolute top-5 right-5 flex h-[48px] w-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-xl transition-transform duration-300 hover:scale-110 hover:rotate-90"
          >
            <GiSplitCross className="h-[24px] w-[24px] fill-white" />
          </button>

          <div className="flex h-full flex-col items-center justify-center gap-5 px-6">
            <div className="mb-3 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-3xl bg-orange-500/20 blur-xl" />
                <img
                  src={logo}
                  alt="CodeStudio Logo"
                  className="relative h-[70px] w-[70px] rounded-3xl border border-white/20 object-cover shadow-[0_0_22px_rgba(255,140,0,0.25)]"
                />
              </div>

              <div className="flex items-center gap-2">
                <FaBuildingColumns className="text-orange-400 text-[22px] drop-shadow-[0_0_12px_rgba(255,140,0,0.5)]" />
                <span className="text-[28px] font-black text-white tracking-wide">
                  Code
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-100">
                    Studio
                  </span>
                </span>
              </div>

              <span className="mt-1 text-xs uppercase tracking-[0.4em] text-white/45">
                Futuristic LMS
              </span>
            </div>

            {renderMobileButton("About", () => scrollToSection("about"))}
            {renderMobileButton("Work", () => scrollToSection("work"))}
            {renderMobileButton("Contact Us", () => scrollToSection("contact"))}

            {userData ? (
              <>
                {renderMobileButton("My Profile", () => {
                  navigate("/profile");
                  setShowHam(false);
                })}
                {renderMobileButton("My Courses", () => {
                  navigate("/enrolledcourses");
                  setShowHam(false);
                })}
              </>
            ) : (
              <>
                {renderMobileButton("Login", () => {
                  navigate("/login");
                  setShowHam(false);
                })}
                {renderMobileButton("Signup", () => {
                  navigate("/signup");
                  setShowHam(false);
                })}
              </>
            )}

            {userData?.role === "educator" &&
              renderMobileButton("Dashboard", () => {
                navigate("/dashboard");
                setShowHam(false);
              })}

            {userData &&
              renderMobileButton("LogOut", () => {
                handleLogout();
                setShowHam(false);
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;