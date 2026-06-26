import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, Area, AreaChart,
} from "recharts";
import img from "../../assets/empty.jpg";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import { setCreatorCourseData } from '../../redux/courseSlice';
import { useDispatch } from 'react-redux';
import { serverUrl } from '../../App';

/* ─────────────────────────────────────────────
   DESIGN TOKENS  — CodeStudio Premium Dark
   Signature: orange→blue diagonal gradient cuts
   through every card's top-left corner border.
───────────────────────────────────────────── */
const T = {
  bg: "#080B14",
  bgDeep: "#050709",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassHover: "rgba(255,255,255,0.07)",

  orange: "#FF6B2C",
  orangeSoft: "rgba(255,107,44,0.15)",
  orangeGlow: "0 0 24px rgba(255,107,44,0.35)",

  blue: "#3B82F6",
  blueSoft: "rgba(59,130,246,0.15)",
  blueGlow: "0 0 24px rgba(59,130,246,0.35)",

  grad: "linear-gradient(135deg, #FF6B2C 0%, #3B82F6 100%)",
  gradSoft: "linear-gradient(135deg, rgba(255,107,44,0.18) 0%, rgba(59,130,246,0.18) 100%)",

  green: "#10B981",
  amber: "#F59E0B",
  purple: "#A78BFA",
  rose: "#F43F5E",

  text: "#F1F5FE",
  textSub: "#94A3B8",
  textMuted: "#4B5B7B",
};

const PIE_PALETTE = [T.orange, T.blue, T.green, T.amber, T.purple, T.rose];

/* ─── Inline <style> for keyframes & scrollbar ─── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    ::-webkit-scrollbar { width: 6px; background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

    @keyframes fadeUp {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0);    }
    }
    @keyframes pulseRing {
      0%,100% { box-shadow: 0 0 0 0 rgba(255,107,44,0.5); }
      50%      { box-shadow: 0 0 0 8px rgba(255,107,44,0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }
    @keyframes float {
      0%,100% { transform: translateY(0px);  }
      50%      { transform: translateY(-6px); }
    }
    @keyframes gradShift {
      0%,100% { background-position: 0% 50%;   }
      50%      { background-position: 100% 50%; }
    }

    .cs-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      animation: fadeUp 0.5s ease both;
    }
    .cs-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255,255,255,0.14);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    .cs-stat-card {
      position: relative;
      overflow: hidden;
    }
    .cs-stat-card::before {
      content:'';
      position:absolute;
      inset:0;
      background: linear-gradient(135deg,rgba(255,107,44,0.06),rgba(59,130,246,0.06));
      opacity:0;
      transition: opacity 0.3s;
      pointer-events:none;
      border-radius:20px;
    }
    .cs-stat-card:hover::before { opacity:1; }

    .cs-btn-primary {
      background: linear-gradient(135deg, #FF6B2C, #3B82F6);
      background-size: 200% 200%;
      border: none;
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      padding: 12px 24px;
      border-radius: 12px;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
      animation: gradShift 4s ease infinite;
      letter-spacing: 0.3px;
    }
    .cs-btn-primary:hover {
      opacity: 0.92;
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(255,107,44,0.4);
    }

    .cs-back-btn {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: #94A3B8;
      width:38px; height:38px;
      border-radius:10px;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .cs-back-btn:hover {
      background: rgba(255,107,44,0.12);
      border-color: rgba(255,107,44,0.4);
      color: #FF6B2C;
    }

    .cs-badge {
      display:inline-flex; align-items:center; gap:6px;
      background: rgba(16,185,129,0.12);
      border: 1px solid rgba(16,185,129,0.25);
      color: #10B981;
      font-size:11px; font-weight:600;
      padding: 3px 10px; border-radius:999px;
      letter-spacing:0.4px;
    }

    .cs-table-row {
      border-bottom: 1px solid rgba(255,255,255,0.05);
      transition: background 0.2s;
    }
    .cs-table-row:hover {
      background: rgba(255,255,255,0.03);
    }
    .cs-table-row:last-child { border-bottom: none; }

    .cs-grad-text {
      background: linear-gradient(135deg, #FF6B2C, #3B82F6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .cs-logo-dot {
      width:8px; height:8px; border-radius:50%;
      background: linear-gradient(135deg,#FF6B2C,#3B82F6);
      animation: pulseRing 2.5s ease-in-out infinite;
    }

    .cs-online-dot {
      width:11px; height:11px; border-radius:50%;
      background: #10B981;
      border: 2px solid #080B14;
      position:absolute; bottom:4px; right:4px;
      animation: pulseRing 2s ease-in-out infinite;
    }

    .cs-orbit-bg {
      position:absolute;
      border-radius:50%;
      pointer-events:none;
      filter: blur(80px);
      opacity:0.12;
    }

    .recharts-tooltip-wrapper { outline:none !important; }
  `}</style>
);

/* ─── Custom Recharts Tooltip ─── */
const DarkTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10,14,28,0.95)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "10px 16px",
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    }}>
      <p style={{ color: T.textSub, fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || T.orange, fontWeight: 700, fontSize: 15 }}>
          {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          <span style={{ color: T.textMuted, fontWeight: 400, fontSize: 11, marginLeft: 6 }}>{p.name}</span>
        </p>
      ))}
    </div>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({ label, value, sub, icon, accent, delay = 0 }) => (
  <div className="cs-card cs-stat-card" style={{ padding: "22px 24px", animationDelay: `${delay}s` }}>
    {/* accent corner line */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, ${accent}, transparent)`,
      borderRadius: "20px 20px 0 0",
    }} />
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <p style={{ color: T.textMuted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>{label}</p>
        <p style={{ color: T.text, fontSize: 28, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ color: T.textSub, fontSize: 12, marginTop: 6 }}>{sub}</p>}
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${accent}1A`,
        border: `1px solid ${accent}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20,
      }}>{icon}</div>
    </div>
  </div>
);

/* ─── Section label ─── */
const SLabel = ({ children }) => (
  <p style={{ color: T.textMuted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>{children}</p>
);

/* ─── Main Dashboard ─── */
function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((s) => s.user);
  const { creatorCourseData } = useSelector((s) => s.course);
  const courses = creatorCourseData || [];

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(serverUrl + `/api/course/removecourse/${courseId}`, { withCredentials: true });
      toast.success("Course Deleted");
      const filteredCourses = courses.filter(c => c._id !== courseId);
      dispatch(setCreatorCourseData(filteredCourses));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete course");
    }
  }

  /* ── Derived datasets ── */
  const shortTitle = (t) => (t?.length > 13 ? t.slice(0, 13) + "…" : t || "");

  const barLecturesData = courses.map((c) => ({
    name: shortTitle(c.title),
    Lectures: c.lectures?.length || 0,
  }));

  const barEnrolData = courses.map((c) => ({
    name: shortTitle(c.title),
    Students: c.enrolledStudents?.length || 0,
  }));

  const pieData = courses
    .map((c) => ({ name: shortTitle(c.title), value: c.enrolledStudents?.length || 0 }))
    .filter((d) => d.value > 0);

  // Line / Area: cumulative student growth simulation across courses
  const lineData = courses.map((c, i) => {
    const prev = courses.slice(0, i).reduce((s, x) => s + (x.enrolledStudents?.length || 0), 0);
    return {
      name: shortTitle(c.title),
      Growth: prev + (c.enrolledStudents?.length || 0),
    };
  });

  const totalEarnings = courses.reduce((s, c) => s + (c.price || 0) * (c.enrolledStudents?.length || 0), 0);
  const totalStudents = courses.reduce((s, c) => s + (c.enrolledStudents?.length || 0), 0);
  const totalLectures = courses.reduce((s, c) => s + (c.lectures?.length || 0), 0);

  const avgRating = courses.length
    ? (courses.reduce((s, c) => s + (c.rating || 4.5), 0) / courses.length).toFixed(1)
    : "—";

  return (
    <>
      <GlobalStyle />
      <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: T.text, position: "relative", overflow: "hidden" }}>

        {/* ── Ambient orbs ── */}
        <div className="cs-orbit-bg" style={{ width: 600, height: 600, background: T.orange, top: -200, left: -200 }} />
        <div className="cs-orbit-bg" style={{ width: 500, height: 500, background: T.blue, top: -100, right: -100 }} />
        <div className="cs-orbit-bg" style={{ width: 400, height: 400, background: T.purple, bottom: 0, left: "30%" }} />

        {/* ══════════ TOP NAV ══════════ */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(8,11,20,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 60,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="cs-back-btn" onClick={() => navigate("/")}>
              <FaArrowLeftLong size={14} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="cs-logo-dot" />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: 17,
                background: "linear-gradient(135deg,#FF6B2C,#3B82F6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                CodeStudio
              </span>
            </div>
            <span style={{ color: T.textMuted, fontSize: 12 }}>/ Dashboard</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="cs-badge">● LIVE</div>
            <img
              src={userData?.photoUrl || img}
              alt="avatar"
              style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,107,44,0.5)" }}
            />
          </div>
        </nav>

        {/* ══════════ CONTENT ══════════ */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 20px 64px" }}>

          {/* ── Hero / Profile ── */}
          <div className="cs-card" style={{
            padding: "32px 32px",
            marginBottom: 28,
            background: "linear-gradient(135deg,rgba(255,107,44,0.07) 0%,rgba(59,130,246,0.07) 50%,rgba(255,255,255,0.03) 100%)",
            position: "relative", overflow: "hidden",
            animationDelay: "0s",
          }}>
            {/* decorative slash */}
            <div style={{
              position: "absolute", right: -60, top: -60,
              width: 280, height: 280,
              background: "linear-gradient(135deg,rgba(255,107,44,0.1),rgba(59,130,246,0.08))",
              borderRadius: "50%",
              filter: "blur(40px)",
            }} />

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24, position: "relative" }}>
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 84, height: 84, borderRadius: "50%",
                  background: "linear-gradient(135deg,#FF6B2C,#3B82F6)",
                  padding: 2,
                }}>
                  <img
                    src={userData?.photoUrl || img}
                    alt="Educator"
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "3px solid #080B14" }}
                  />
                </div>
                <div className="cs-online-dot" />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ color: T.textSub, fontSize: 12, fontWeight: 500, letterSpacing: "0.5px", marginBottom: 4 }}>
                  Welcome back 👋
                </p>
                <h1 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 26, fontWeight: 700, lineHeight: 1.1,
                  background: "linear-gradient(135deg,#FF6B2C,#F1F5FE 60%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  marginBottom: 6,
                }}>
                  {userData?.name || "Educator"}
                </h1>
                <p style={{ color: T.textSub, fontSize: 13, maxWidth: 420 }}>
                  {userData?.description || "Building the future of online education — one lesson at a time."}
                </p>
              </div>

              {/* Earnings pill + CTA */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14, padding: "10px 20px", textAlign: "right",
                }}>
                  <p style={{ color: T.textMuted, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Total Earnings</p>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 24, fontWeight: 800,
                    background: "linear-gradient(135deg,#FF6B2C,#F59E0B)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>
                    ₹{totalEarnings.toLocaleString()}
                  </p>
                </div>
                <button className="cs-btn-primary" onClick={() => navigate("/courses")}>
                  + New Course
                </button>
              </div>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total Courses" value={courses.length} sub="Published & live" icon="🎓" accent={T.orange} delay={0.05} />
            <StatCard label="Total Students" value={totalStudents.toLocaleString()} sub="Across all courses" icon="👥" accent={T.blue} delay={0.1} />
            <StatCard label="Total Lectures" value={totalLectures} sub="Hours of content" icon="📹" accent={T.green} delay={0.15} />
            <StatCard label="Avg. Rating" value={`${avgRating} ★`} sub="Student satisfaction" icon="⭐" accent={T.amber} delay={0.2} />
          </div>

          {/* ── Charts row 1: Bar Lectures + Area Growth ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20, marginBottom: 20 }}>

            {/* Bar — Lectures */}
            <div className="cs-card" style={{ padding: "24px 24px 12px", animationDelay: "0.25s" }}>
              <SLabel>Lectures per Course</SLabel>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barLecturesData} barSize={22}>
                  <defs>
                    <linearGradient id="barGradO" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B2C" stopOpacity={1} />
                      <stop offset="100%" stopColor="#FF6B2C" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,107,44,0.06)" }} />
                  <Bar dataKey="Lectures" fill="url(#barGradO)" radius={[7, 7, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Area — Student Growth */}
            <div className="cs-card" style={{ padding: "24px 24px 12px", animationDelay: "0.3s" }}>
              <SLabel>Cumulative Student Growth</SLabel>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={lineData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip content={<DarkTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Growth"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    dot={{ r: 5, fill: "#3B82F6", stroke: "#080B14", strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Charts row 2: Bar Enrol + Pie ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20, marginBottom: 20 }}>

            {/* Bar — Students */}
            <div className="cs-card" style={{ padding: "24px 24px 12px", animationDelay: "0.35s" }}>
              <SLabel>Enrolment per Course</SLabel>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barEnrolData} barSize={22}>
                  <defs>
                    <linearGradient id="barGradB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
                  <Bar dataKey="Students" fill="url(#barGradB)" radius={[7, 7, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie — Enrolment Distribution */}
            <div className="cs-card" style={{ padding: "24px 24px 12px", animationDelay: "0.4s" }}>
              <SLabel>Course Distribution</SLabel>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <defs>
                      {PIE_PALETTE.map((c, i) => (
                        <radialGradient key={i} id={`pie${i}`} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor={c} stopOpacity={1} />
                          <stop offset="100%" stopColor={c} stopOpacity={0.65} />
                        </radialGradient>
                      ))}
                    </defs>
                    <Pie
                      data={pieData}
                      cx="50%" cy="48%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={`url(#pie${i % PIE_PALETTE.length})`} />
                      ))}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={7}
                      formatter={(v) => <span style={{ color: T.textSub, fontSize: 11 }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ color: T.textMuted, fontSize: 13 }}>No enrolment data yet — publish a course!</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Line Chart — Revenue ── */}
          <div className="cs-card" style={{ padding: "24px 24px 12px", marginBottom: 20, animationDelay: "0.45s" }}>
            <SLabel>Revenue by Course (₹)</SLabel>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={courses.map((c) => ({
                name: shortTitle(c.title),
                Revenue: (c.price || 0) * (c.enrolledStudents?.length || 0),
              }))}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF6B2C" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} width={44}
                  tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`}
                />
                <Tooltip content={<DarkTooltip prefix="₹" />} />
                <Line
                  type="monotone"
                  dataKey="Revenue"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#FF6B2C", stroke: "#080B14", strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ── Course Table ── */}
          <div className="cs-card" style={{ padding: "24px", animationDelay: "0.5s" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <SLabel>All Courses</SLabel>
              <button
                onClick={() => navigate("/courses")}
                style={{
                  background: "rgba(255,107,44,0.1)",
                  border: "1px solid rgba(255,107,44,0.25)",
                  color: T.orange,
                  fontSize: 12, fontWeight: 600, padding: "6px 14px",
                  borderRadius: 8, cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                + Add Course
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["#", "Course Title", "Price", "Students", "Lectures", "Revenue", "Status", "Action"].map((h) => (
                      <th key={h} style={{
                        color: T.textMuted, fontSize: 10, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.8px",
                        textAlign: "left", paddingBottom: 12, paddingRight: h === "Action" ? 0 : 20,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ color: T.textMuted, fontSize: 13, padding: "32px 0", textAlign: "center" }}>
                        No courses yet — create your first one to see data here.
                      </td>
                    </tr>
                  ) : courses.map((c, i) => {
                    const students = c.enrolledStudents?.length || 0;
                    const revenue = (c.price || 0) * students;
                    const lectures = c.lectures?.length || 0;
                    return (
                      <tr key={i} className="cs-table-row">
                        <td style={{ padding: "14px 20px 14px 0", color: T.textMuted, fontSize: 12 }}>
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td style={{ padding: "14px 20px 14px 0", color: T.text, fontWeight: 500, fontSize: 13, maxWidth: 200 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                              background: `linear-gradient(135deg,${PIE_PALETTE[i % PIE_PALETTE.length]}33,${PIE_PALETTE[(i + 2) % PIE_PALETTE.length]}33)`,
                              border: `1px solid ${PIE_PALETTE[i % PIE_PALETTE.length]}44`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 14,
                            }}>🎓</div>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px 14px 0", color: T.textSub, fontSize: 13 }}>₹{(c.price || 0).toLocaleString()}</td>
                        <td style={{ padding: "14px 20px 14px 0" }}>
                          <span style={{ color: T.blue, fontWeight: 700, fontSize: 13 }}>{students}</span>
                        </td>
                        <td style={{ padding: "14px 20px 14px 0", color: T.textSub, fontSize: 13 }}>{lectures}</td>
                        <td style={{ padding: "14px 20px 14px 0" }}>
                          <span style={{ color: T.orange, fontWeight: 700, fontSize: 13 }}>₹{revenue.toLocaleString()}</span>
                        </td>
                        <td style={{ padding: "14px 0 14px 0" }}>
                          <span style={{
                            background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
                            color: T.green, fontSize: 10, fontWeight: 700,
                            padding: "3px 10px", borderRadius: 999, letterSpacing: "0.4px",
                          }}>LIVE</span>
                        </td>
                        <td style={{ padding: "14px 0", display: "flex", gap: "8px", alignItems: "center", height: "60px" }}>
                           <button 
                             onClick={() => navigate(`/addcourses/${c._id}`)}
                             style={{
                               background: "rgba(255,255,255,0.05)",
                               border: "1px solid rgba(255,255,255,0.1)",
                               color: T.textSub, padding: "8px", borderRadius: "8px",
                               cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                               transition: "all 0.2s"
                             }}
                             onMouseEnter={(e) => { e.currentTarget.style.color = T.orange; e.currentTarget.style.borderColor = "rgba(255,107,44,0.4)"; }}
                             onMouseLeave={(e) => { e.currentTarget.style.color = T.textSub; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                            >
                             <FaEdit size={12} />
                           </button>
                           <button 
                             onClick={() => handleDeleteCourse(c._id)}
                             style={{
                               background: "rgba(244,63,94,0.1)",
                               border: "1px solid rgba(244,63,94,0.2)",
                               color: T.rose, padding: "8px", borderRadius: "8px",
                               cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                               transition: "all 0.2s"
                             }}
                             onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.2)"; e.currentTarget.style.borderColor = "rgba(244,63,94,0.4)"; }}
                             onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.1)"; e.currentTarget.style.borderColor = "rgba(244,63,94,0.2)"; }}
                            >
                             <FaTrash size={12} />
                           </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Footer ── */}
          <p style={{ color: T.textMuted, fontSize: 11, textAlign: "center", marginTop: 40, letterSpacing: "0.5px" }}>
            <span className="cs-grad-text" style={{ fontWeight: 700 }}>CodeStudio</span> · Premium Educator Dashboard
          </p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;