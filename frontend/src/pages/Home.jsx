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
import { motion } from "framer-motion";
import {
  FaBrain,
  FaBookOpen,
  FaWaveSquare,
  FaFileLines,
  FaClipboardQuestion,
  FaUserTie,
  FaRobot,
} from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";

function Home() {
  const navigate = useNavigate();
  const particles = Array.from({ length: 24 });
  const statsTriggerRef = useRef(null);
  const heroTextRef = useRef(null);
  const [startCounting, setStartCounting] = useState(false);
  const [heroInView, setHeroInView] = useState(false);

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroInView(true);
          heroObserver.disconnect();
        }
      },
      {
        threshold: 0.35,
      }
    );

    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounting(true);
          statsObserver.disconnect();
        }
      },
      {
        threshold: 0.7,
      }
    );

    if (heroTextRef.current) heroObserver.observe(heroTextRef.current);
    if (statsTriggerRef.current) statsObserver.observe(statsTriggerRef.current);

    return () => {
      heroObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  return (
    <div className="w-full overflow-hidden bg-[#020617] text-white">
      <style>{`
        @keyframes shimmerSlide {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        .card-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,255,255,0.04) 35%,
            rgba(251,146,60,0.16) 50%,
            rgba(255,255,255,0.04) 65%,
            transparent 100%
          );
          transform: translateX(-120%);
          animation: shimmerSlide 3.6s linear infinite;
          pointer-events: none;
        }
      `}</style>

      <section id="home" className="relative w-full min-h-screen overflow-hidden">
        <Nav />

        <div className="absolute inset-0">
          <img
            src={home}
            className="w-full h-full object-cover opacity-[0.10]"
            alt="background"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(249,115,22,0.20),transparent_22%),radial-gradient(circle_at_85%_18%,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(251,146,60,0.10),transparent_25%),linear-gradient(to_bottom,rgba(2,6,23,0.72),rgba(2,6,23,0.93),rgba(2,6,23,1))]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px] opacity-[0.08]" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-orange-300/30 blur-[2px]"
              style={{
                width: `${4 + (i % 5) * 3}px`,
                height: `${4 + (i % 5) * 3}px`,
                left: `${(i * 9 + 5) % 100}%`,
                top: `${(i * 13 + 7) % 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, i % 2 === 0 ? 14 : -14, 0],
                opacity: [0.1, 0.8, 0.1],
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: 5 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.08,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 pt-[120px] pb-16 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
            <motion.div
              ref={heroTextRef}
              initial={{ opacity: 0, y: 90 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 90 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: 0.08, duration: 0.8 }}
                className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-white/5 backdrop-blur-xl px-4 py-2 text-sm text-orange-200 shadow-[0_0_35px_rgba(249,115,22,0.12)]"
              >
                <HiSparkles className="text-orange-300" />
                Immersive AI-Powered Learning Experience
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                transition={{ delay: 0.18, duration: 0.9 }}
                className="mt-6 text-[34px] sm:text-[46px] lg:text-[68px] leading-[1.05] font-extrabold tracking-tight"
              >
                Learn Faster with a
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-white">
                  Smart Teacher
                </span>
                <br />
                inside CodeStudio
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 70 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }}
                transition={{ delay: 0.28, duration: 0.9 }}
                className="mt-6 max-w-[650px] text-white/70 text-[15px] sm:text-[17px] leading-8"
              >
                CodeStudio brings an animated smart teacher experience with AI
                guidance, creative learning tools, intelligent practice, and a
                futuristic interface designed to keep students engaged and motivated.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 70 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }}
                transition={{ delay: 0.38, duration: 0.9 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <button
                  className="group relative overflow-hidden px-7 py-3 rounded-2xl border border-orange-300/40 bg-white/10 backdrop-blur-xl text-white font-medium shadow-[0_0_30px_rgba(249,115,22,0.16)] hover:scale-[1.03] transition-all duration-500"
                  onClick={() => navigate("/searchwithai")}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-black transition-colors duration-500">
                    Search with AI
                    <img
                      src={ai}
                      className="w-[28px] h-[28px] rounded-full hidden lg:block"
                      alt="ai"
                    />
                    <img
                      src={ai1}
                      className="w-[32px] h-[32px] rounded-full lg:hidden"
                      alt="ai mobile"
                    />
                  </span>
                </button>

                <button
                  className="px-7 py-3 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl text-white/90 font-medium hover:border-orange-300/30 hover:bg-white/10 transition-all duration-500"
                  onClick={() => navigate("/profile")}
                >
                  Go to Profile
                </button>
              </motion.div>

              <motion.div
                ref={statsTriggerRef}
                initial={{ opacity: 0, y: 80 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
                transition={{ delay: 0.48, duration: 1 }}
                className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <StatCard
                  title="Smart Progress"
                  value={87}
                  suffix="%"
                  icon={<FaWaveSquare />}
                  start={startCounting}
                />
                <StatCard
                  title="Active Courses"
                  value={12}
                  suffix="+"
                  icon={<FaBookOpen />}
                  start={startCounting}
                />
                <StatCard
                  title="Course Completion"
                  value={78}
                  suffix="%"
                  icon={<FaBrain />}
                  start={startCounting}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 70, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.25 }}
              className="relative"
            >
              <div className="absolute -top-8 right-0 w-40 h-40 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-white/5 blur-3xl" />

              <motion.div
                whileHover={{ y: -8, rotateX: 3, rotateY: -3 }}
                transition={{ duration: 0.35 }}
                className="relative rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.38)] overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-white/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.20),transparent_28%)]" />

                <motion.div
                  animate={{ y: [0, -10, 0], opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 left-6 px-4 py-2 rounded-2xl border border-orange-300/20 bg-black/20 backdrop-blur-xl text-orange-200 text-xs sm:text-sm shadow-[0_0_25px_rgba(249,115,22,0.12)]"
                >
                  Smart Teacher Online
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-20 right-6 px-4 py-2 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl text-white/80 text-xs sm:text-sm"
                >
                  AI Guidance Active
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-8 left-8 px-4 py-2 rounded-2xl border border-orange-300/20 bg-black/20 backdrop-blur-xl text-orange-100 text-xs sm:text-sm"
                >
                  Animated Mentor Experience
                </motion.div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[16%] right-[10%] w-24 h-24 rounded-full border border-dashed border-orange-300/20"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-[18%] right-[16%] w-16 h-16 rounded-full border border-dashed border-white/10"
                />

                <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                  <div className="relative rounded-[28px] overflow-hidden border border-white/10 bg-[#07111f] min-h-[580px] flex items-end justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_38%)]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-[110px] bg-gradient-to-t from-orange-500/10 to-transparent" />

                    <motion.img
                      src={smartTeacher}
                      alt="Smart Teacher"
                      className="relative z-10 w-full max-w-[520px] object-contain drop-shadow-[0_25px_60px_rgba(249,115,22,0.18)]"
                      initial={{ opacity: 0, y: 20, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />

                    <motion.div
                      animate={{
                        opacity: [0.25, 0.6, 0.25],
                        scale: [1, 1.08, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute bottom-[22%] left-[50%] -translate-x-1/2 w-[220px] h-[120px] bg-white/10 blur-3xl rounded-full"
                    />

                    <motion.div
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-[25%] left-[8%] w-14 h-14 rounded-2xl border border-orange-300/20 bg-white/5 backdrop-blur-xl flex items-center justify-center text-orange-300 text-xl"
                    >
                      <FaRobot />
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-[38%] right-[10%] w-14 h-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white text-xl"
                    >
                      <HiSparkles />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-4 mt-5">
                {[
                  {
                    title: "AI Quiz Generator",
                    desc: "Generate topic-based quizzes with smart difficulty and instant variation.",
                    icon: <FaClipboardQuestion />,
                  },
                  {
                    title: "AI Notes Generator",
                    desc: "Create revision notes, concise summaries, and key concept explanations.",
                    icon: <FaFileLines />,
                  },
                  {
                    title: "AI Mock Interview",
                    desc: "Practice interview rounds with adaptive AI questions and feedback.",
                    icon: <FaUserTie />,
                  },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.35 }}
                    className="relative rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
                  >
                    <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
                    <div className="relative z-10">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-orange-500/15 text-orange-300 border border-orange-300/20 text-lg">
                        {item.icon}
                      </div>
                      <h4 className="mt-4 text-lg font-bold">{item.title}</h4>
                      <p className="mt-2 text-white/65 leading-7 text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
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

function CountUp({ end, duration = 2200, suffix = "", start = false }) {
  const [count, setCount] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!start || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    let startTime = null;
    let frame;

    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        frame = requestAnimationFrame(update);
      } else {
        setCount(end);
      }
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [start, end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

function StatCard({ title, value, suffix, icon, start }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.35 }}
      className="card-shimmer relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
      <div className="relative z-10">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-orange-500/15 text-orange-300 border border-orange-300/20 text-lg">
          {icon}
        </div>
        <h3 className="mt-4 text-white/65 text-sm">{title}</h3>
        <p className="mt-1 text-2xl font-bold text-white">
          <CountUp end={value} suffix={suffix} start={start} />
        </p>
      </div>
    </motion.div>
  );
}

export default Home;
