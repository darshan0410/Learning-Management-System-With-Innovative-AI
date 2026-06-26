import React, { useEffect, useRef, useState } from "react";
import home from "../assets/home1.jpg";
import smartTeacher from "../assets/smart-teacher.png";
import Nav from "../components/Nav";
import Logos from "../components/Logos";
import Cardspage from "../components/Cardspage";
import ExploreCourses from "../components/ExploreCourses";
import About from "../components/About";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import ReviewPage from "../components/ReviewPage";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBrain,
  FaBookOpen,
  FaWaveSquare,
  FaFileLines,
  FaClipboardQuestion,
  FaUserTie,
  FaRobot,
  FaArrowRight,
  FaBolt,
  FaGraduationCap,
  FaFire,
} from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";

/* ─────────────────────────────── AI Feature data ─────────────────────────── */
const AI_FEATURES = [
  {
    route: "/mockinterview",
    title: "AI Mock Interview",
    subtitle: "Practice & Ace It",
    desc: "Adaptive interview rounds powered by AI — get real questions, instant feedback, and confidence before the real thing.",
    icon: <FaUserTie />,
    accent: "from-violet-500 via-purple-400 to-fuchsia-400",
    glow: "rgba(139,92,246,0.35)",
    border: "rgba(167,139,250,0.25)",
    dot: "bg-violet-400",
    badge: "Live AI",
  },
  {
    route: "/aiquiz",
    title: "AI Quiz Generator",
    subtitle: "Test Your Knowledge",
    desc: "Generate topic-based quizzes with smart difficulty scaling, instant grading, and detailed explanations.",
    icon: <FaClipboardQuestion />,
    accent: "from-orange-500 via-amber-400 to-yellow-300",
    glow: "rgba(249,115,22,0.35)",
    border: "rgba(251,146,60,0.25)",
    dot: "bg-orange-400",
    badge: "Smart",
  },
  {
    route: "/resume-analyzer",
    title: "AI Resume Analyzer",
    subtitle: "Optimize Your CV",
    desc: "Get instant AI feedback on your resume, ATS scoring, and targeted suggestions to land your dream job.",
    icon: <FaFileLines />,
    accent: "from-blue-500 via-cyan-400 to-sky-300",
    glow: "rgba(56,187,248,0.35)",
    border: "rgba(125,211,252,0.25)",
    dot: "bg-blue-400",
    badge: "Smart ATS",
  },
];

/* ─────────────────────────────── CountUp ──────────────────────────────────── */
function CountUp({ end, duration = 2200, suffix = "", start = false }) {
  const [count, setCount] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!start || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;
    let startTime = null;
    let frame;
    const update = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) frame = requestAnimationFrame(update);
      else setCount(end);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [start, end, duration]);

  return <span>{count}{suffix}</span>;
}

/* ─────────────────────────────── StatCard ─────────────────────────────────── */
function StatCard({ title, value, suffix, icon, start }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5"
    >
      {/* Animated shimmer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(120deg,transparent 30%,rgba(251,146,60,0.10) 50%,transparent 70%)",
          animation: "shimmerSlide 3.6s linear infinite",
        }}
      />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/15 text-orange-300 border border-orange-300/20 text-base">
          {icon}
        </div>
        <p className="mt-4 text-white/50 text-xs tracking-widest uppercase">{title}</p>
        <p className="mt-1 text-2xl font-bold text-white">
          <CountUp end={value} suffix={suffix} start={start} />
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────── AIFeatureCard ────────────────────────────── */
function AIFeatureCard({ feature, index }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={() => navigate(feature.route)}
      className="group relative cursor-pointer rounded-[28px] border bg-white/[0.03] backdrop-blur-2xl overflow-hidden"
      style={{ borderColor: feature.border }}
    >
      {/* Glow layer */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-[28px]"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${feature.glow}, transparent 70%)`,
        }}
      />

      {/* Animated gradient border top */}
      <div
        className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${feature.accent} opacity-70`}
      />

      <div className="relative z-10 p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl border border-white/10"
            style={{
              background: `linear-gradient(135deg, ${feature.glow}, rgba(255,255,255,0.05))`,
            }}
          >
            {feature.icon}
          </div>
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-white/10 bg-white/5 text-white/70`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${feature.dot} animate-pulse`} />
            {feature.badge}
          </span>
        </div>

        {/* Text */}
        <p className="text-[10px] tracking-[0.15em] uppercase text-white/40 font-medium mb-1">
          {feature.subtitle}
        </p>
        <h3 className="text-xl font-bold text-white mb-3 leading-tight">{feature.title}</h3>
        <p className="text-white/55 text-sm leading-7">{feature.desc}</p>

        {/* CTA row */}
        <motion.div
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 flex items-center gap-2"
        >
          <span className={`text-sm font-semibold bg-gradient-to-r ${feature.accent} bg-clip-text text-transparent`}>
            Launch Now
          </span>
          <FaArrowRight
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.4)" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────── Home ─────────────────────────────────────── */
function Home() {
  const navigate = useNavigate();
  const particles = Array.from({ length: 28 });
  const statsTriggerRef = useRef(null);
  const heroTextRef = useRef(null);
  const [startCounting, setStartCounting] = useState(false);
  const [heroInView, setHeroInView] = useState(false);

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeroInView(true); heroObserver.disconnect(); } },
      { threshold: 0.3 }
    );
    const statsObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStartCounting(true); statsObserver.disconnect(); } },
      { threshold: 0.6 }
    );
    if (heroTextRef.current) heroObserver.observe(heroTextRef.current);
    if (statsTriggerRef.current) statsObserver.observe(statsTriggerRef.current);
    return () => { heroObserver.disconnect(); statsObserver.disconnect(); };
  }, []);

  return (
    <div className="w-full overflow-hidden bg-[#020617] text-white">
      <style>{`
        @keyframes shimmerSlide {
          0%   { transform: translateX(-130%); }
          100% { transform: translateX(130%); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-22px) scale(1.04); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .ai-section-title {
          background: linear-gradient(90deg, #fff 0%, #fb923c 50%, #fde68a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* ───────────────────── Hero Section ───────────────────── */}
      <section id="home" className="relative w-full min-h-screen overflow-hidden">
        <Nav />

        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <img src={home} className="w-full h-full object-cover opacity-[0.07]" alt="" />

          {/* Aurora bleed — indigo + orange */}
          <div className="absolute top-0 left-0 w-[60%] h-[50%]"
            style={{ background: "radial-gradient(ellipse at 10% 0%, rgba(99,102,241,0.18), transparent 55%)" }} />
          <div className="absolute top-0 right-0 w-[50%] h-[45%]"
            style={{ background: "radial-gradient(ellipse at 90% 5%, rgba(249,115,22,0.22), transparent 50%)" }} />
          <div className="absolute bottom-0 left-[20%] w-[60%] h-[40%]"
            style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(251,146,60,0.10), transparent 60%)" }} />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.92) 70%, rgba(2,6,23,1) 100%)" }} />

          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${3 + (i % 4) * 3}px`,
                height: `${3 + (i % 4) * 3}px`,
                left: `${(i * 7 + 3) % 100}%`,
                top: `${(i * 11 + 5) % 100}%`,
                background: i % 3 === 0
                  ? "rgba(249,115,22,0.5)"
                  : i % 3 === 1
                  ? "rgba(139,92,246,0.4)"
                  : "rgba(255,255,255,0.2)",
                filter: "blur(1px)",
              }}
              animate={{ y: [0, -28, 0], x: [0, i % 2 === 0 ? 12 : -12, 0], opacity: [0.1, 0.7, 0.1], scale: [1, 1.3, 1] }}
              transition={{ duration: 5 + i * 0.18, repeat: Infinity, ease: "easeInOut", delay: i * 0.07 }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 pt-[120px] pb-20 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

            {/* Left column */}
            <motion.div
              ref={heroTextRef}
              initial={{ opacity: 0, y: 80 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.05, duration: 0.7 }}
                className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/8 backdrop-blur-xl px-4 py-2 text-sm text-orange-200"
                style={{ boxShadow: "0 0 30px rgba(249,115,22,0.12)" }}
              >
                <HiSparkles className="text-orange-300" />
                Immersive AI-Powered Learning Experience
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15, duration: 0.9 }}
                className="mt-6 text-[36px] sm:text-[48px] lg:text-[70px] leading-[1.03] font-extrabold tracking-tight"
              >
                Learn Faster with a
                <br />
                <span
                  className="inline-block"
                  style={{
                    background: "linear-gradient(100deg, #f97316 0%, #fbbf24 45%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 40px rgba(249,115,22,0.3))",
                  }}
                >
                  Smart Teacher
                </span>
                <br />
                <span className="text-white/90">inside CodeStudio</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25, duration: 0.9 }}
                className="mt-6 max-w-[580px] text-white/60 text-[15px] sm:text-[17px] leading-8"
              >
                CodeStudio brings an animated smart teacher experience with AI guidance, creative learning tools, intelligent practice, and a futuristic interface designed to keep students engaged and motivated.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.34, duration: 0.9 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <button
                  className="group relative overflow-hidden px-7 py-3.5 rounded-2xl border border-orange-300/40 bg-white/8 backdrop-blur-xl text-white font-semibold transition-all duration-500 hover:scale-[1.03]"
                  style={{ boxShadow: "0 0 28px rgba(249,115,22,0.18)" }}
                  onClick={() => navigate("/searchwithai")}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-black transition-colors duration-500">
                    Search with AI
                    <img src={ai} className="w-[28px] h-[28px] rounded-full hidden lg:block" alt="ai" />
                    <img src={ai1} className="w-[32px] h-[32px] rounded-full lg:hidden" alt="ai mobile" />
                  </span>
                </button>

                <button
                  className="px-7 py-3.5 rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl text-white/85 font-semibold hover:border-violet-400/30 hover:bg-violet-500/8 transition-all duration-400"
                  onClick={() => navigate("/profile")}
                >
                  Go to Profile
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                ref={statsTriggerRef}
                initial={{ opacity: 0, y: 40 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.44, duration: 1 }}
                className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <StatCard title="Smart Progress" value={87} suffix="%" icon={<FaWaveSquare />} start={startCounting} />
                <StatCard title="Active Courses" value={12} suffix="+" icon={<FaBookOpen />} start={startCounting} />
                <StatCard title="Completion Rate" value={78} suffix="%" icon={<FaBrain />} start={startCounting} />
              </motion.div>
            </motion.div>

            {/* Right column — teacher card */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Orb glows */}
              <div className="absolute -top-12 right-0 w-52 h-52 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(249,115,22,0.22), transparent 70%)", filter: "blur(30px)" }} />
              <div className="absolute bottom-8 left-6 w-44 h-44 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)", filter: "blur(28px)", animation: "orbFloat 6s ease-in-out infinite" }} />

              <motion.div
                whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative rounded-[36px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl overflow-hidden"
              >
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, transparent 40%, rgba(139,92,246,0.06) 100%)" }} />

                {/* Floating labels */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-7 left-6 flex items-center gap-2 px-4 py-2 rounded-2xl border border-orange-300/20 bg-black/25 backdrop-blur-xl text-orange-200 text-xs font-medium"
                  style={{ boxShadow: "0 0 20px rgba(249,115,22,0.10)" }}>
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  Smart Teacher Online
                </motion.div>

                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-20 right-6 flex items-center gap-2 px-4 py-2 rounded-2xl border border-violet-400/20 bg-black/25 backdrop-blur-xl text-violet-200 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  AI Guidance Active
                </motion.div>

                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  className="absolute bottom-[30%] left-7 flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-400/20 bg-black/25 backdrop-blur-xl text-emerald-200 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Animated Mentor
                </motion.div>

                {/* Dashed orbit rings */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[14%] right-[8%] w-24 h-24 rounded-full border border-dashed border-orange-300/15" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-[15%] right-[14%] w-16 h-16 rounded-full border border-dashed border-violet-300/12" />

                <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                  <div className="relative rounded-[28px] overflow-hidden border border-white/[0.07] bg-[#060e1e] min-h-[580px] flex items-end justify-center">
                    <div className="absolute inset-0"
                      style={{ background: "radial-gradient(circle at 50% 30%, rgba(249,115,22,0.10), transparent 50%)" }} />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, #020617 0%, transparent 45%)" }} />
                    <div className="absolute bottom-0 w-full h-28"
                      style={{ background: "linear-gradient(to top, rgba(249,115,22,0.08), transparent)" }} />

                    <motion.img
                      src={smartTeacher}
                      alt="Smart Teacher"
                      className="relative z-10 w-full max-w-[500px] object-contain"
                      style={{ filter: "drop-shadow(0 30px 60px rgba(249,115,22,0.20))" }}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 1.1, delay: 0.4 }}
                    />

                    {/* Glow pulse under teacher */}
                    <motion.div
                      animate={{ opacity: [0.2, 0.55, 0.2], scale: [1, 1.1, 1] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[200px] h-[100px] rounded-full blur-3xl"
                      style={{ background: "rgba(249,115,22,0.15)" }} />

                    {/* Floating icons */}
                    <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-[22%] left-[8%] w-14 h-14 rounded-2xl border border-orange-300/20 bg-white/[0.04] backdrop-blur-xl flex items-center justify-center text-orange-300 text-xl">
                      <FaRobot />
                    </motion.div>
                    <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-[36%] right-[8%] w-14 h-14 rounded-2xl border border-violet-300/20 bg-white/[0.04] backdrop-blur-xl flex items-center justify-center text-violet-300 text-xl">
                      <HiSparkles />
                    </motion.div>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                      className="absolute top-[54%] left-[6%] w-12 h-12 rounded-2xl border border-emerald-300/15 bg-white/[0.03] backdrop-blur-xl flex items-center justify-center text-emerald-300 text-base">
                      <FaBolt />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────── AI Studio Section ───────────────────── */}
      <section className="relative w-full py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(2,6,23,1) 0%, rgba(5,9,32,1) 50%, rgba(2,6,23,1) 100%)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), rgba(139,92,246,0.3), transparent)" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(249,115,22,0.15), transparent)" }} />
          {/* Subtle center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px]"
            style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.07), transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
        
            <h2 className="text-[38px] sm:text-[52px] font-extrabold leading-tight tracking-tight ai-section-title">
              Your AI Learning Studio
            </h2>
            <p className="mt-4 text-white/50 text-base sm:text-lg max-w-[560px] mx-auto leading-8">
              Three intelligent tools — built to accelerate how you learn, practice, and prepare.
            </p>
          </motion.div>

          {/* AI Feature Cards grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {AI_FEATURES.map((feature, i) => (
              <AIFeatureCard key={feature.route} feature={feature} index={i} />
            ))}
          </div>

          {/* Bottom nudge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <div className="flex items-center gap-3">
              {[FaGraduationCap, FaFire, HiSparkles].map((Icon, i) => (
                <div key={i} className="w-9 h-9 rounded-xl border border-white/8 bg-white/[0.03] flex items-center justify-center text-white/40 text-sm">
                  <Icon />
                </div>
              ))}
              <span className="text-white/40 text-sm">
                Trusted by <span className="text-white/70 font-semibold">10,000+</span> learners
              </span>
            </div>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <button
              onClick={() => navigate("/searchwithai")}
              className="flex items-center gap-2 text-sm text-orange-300 font-semibold hover:text-orange-200 transition-colors"
            >
              Explore all features <FaArrowRight className="text-xs" />
            </button>
          </motion.div>
        </div>
      </section>

      <Logos />
      <ExploreCourses />
      <Cardspage />
      <About />
      <ReviewPage />
      <Footer />
    </div>
  );
}

export default Home;