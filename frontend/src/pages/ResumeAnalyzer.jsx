import React, { useState } from "react";
import { 
  FaUpload, FaFilePdf, FaArrowRight, FaChartPie, FaSpinner, 
  FaArrowLeft, FaBriefcase, FaExclamationTriangle, FaCheckCircle, 
  FaPenNib, FaSearchPlus, FaSpellCheck 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from "recharts";

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const uploadRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}` + "/api/interview/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!uploadRes.data.success) {
        throw new Error(uploadRes.data.error || "Failed to parse resume file.");
      }

      const text = uploadRes.data.text;

      const analyzeRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}` + "/api/interview/analyze-resume", {
        resumeText: text,
        targetRole: targetRole.trim()
      });

      if (!analyzeRes.data.success) {
        throw new Error(analyzeRes.data.error || "Failed to analyze resume.");
      }

      setResults(analyzeRes.data.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  const renderRadarChart = () => {
    if (!results || !results.categoryScores) return null;
    const data = [
      { subject: 'Impact', A: results.categoryScores.impact || 0, fullMark: 100 },
      { subject: 'Skills', A: results.categoryScores.skills || 0, fullMark: 100 },
      { subject: 'Formatting', A: results.categoryScores.formatting || 0, fullMark: 100 },
      { subject: 'Clarity', A: results.categoryScores.communication || 0, fullMark: 100 },
    ];

    return (
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Score" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="relative max-w-5xl mx-auto space-y-10 z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 tracking-tight">
              AI Resume Analyzer
            </h1>
            <p className="text-white/60 mt-1 text-lg">Upload your CV to get rigorous ATS scoring and executive feedback.</p>
          </div>
        </div>

        {/* Upload & Setup Box */}
        {!results && (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in mt-12">
            <div className="flex flex-col space-y-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:border-blue-500/30 transition-all">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-3">
                  <FaBriefcase className="text-blue-400" /> Target Job Role
                </h2>
                <p className="text-sm text-white/50 mb-6">Tell us what you're applying for so the AI can score ATS relevance accurately.</p>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Frontend Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  disabled={loading}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all font-medium placeholder:text-white/20"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-center gap-3">
                  <FaExclamationTriangle /> {error}
                </div>
              )}
            </div>

            <div className="border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02] p-10 text-center hover:bg-white/[0.04] hover:border-blue-500/40 transition-all relative flex flex-col items-center justify-center min-h-[280px]">
              <input 
                type="file" 
                accept=".pdf,.txt,.docx"
                onChange={handleFileChange}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {!file ? (
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-20 h-20 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    <FaUpload />
                  </div>
                  <div>
                    <p className="text-xl font-semibold mb-2 text-white/90">Drop your resume here</p>
                    <p className="text-white/40 text-sm">Supports PDF, DOCX, TXT (Max 5MB)</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                    <FaFilePdf />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-300 mb-1">{file.name}</p>
                    <p className="text-emerald-400/60 text-sm font-medium">Ready to analyze</p>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="group w-full md:w-auto py-4 px-10 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-[0_0_60px_rgba(14,165,233,0.5)] transform hover:-translate-y-1"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" /> Analyzing Candidate...
                  </>
                ) : (
                  <>
                    Generate Deep Analysis <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {results && (
          <div className="animate-fade-in space-y-8">
            
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 border border-white/10 bg-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="relative w-40 h-40 mb-4">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 filter drop-shadow-lg">
                    <path
                      className="text-white/5"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <path
                      className={results.overallScore >= 80 ? "text-emerald-400" : results.overallScore >= 60 ? "text-yellow-400" : "text-rose-400"}
                      strokeDasharray={`${results.overallScore || Number(results.atsScore)}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                      {results.overallScore || results.atsScore}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 tracking-wide">Overall Match</h3>
                <p className="text-white/40 text-sm font-medium">ATS parsed metric</p>
              </div>

              <div className="col-span-1 md:col-span-2 border border-white/10 bg-[#070f22] rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center backdrop-blur-xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl opacity-50" />
                <div className="flex-1 z-10 w-full">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white/90">
                    <FaChartPie className="text-sky-400" /> Executive Summary
                  </h3>
                  <p className="text-white/70 leading-relaxed text-base font-medium">
                    {results.summary}
                  </p>
                </div>
                <div className="w-full md:w-[280px] h-[220px] flex-shrink-0 z-10">
                  {renderRadarChart()}
                </div>
              </div>
            </div>

            {/* Actionable Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-emerald-400 font-bold mb-6 text-xl flex items-center gap-3">
                  <FaCheckCircle /> Key Strengths
                </h3>
                <ul className="space-y-4">
                  {results.strengths?.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-white/80 text-sm leading-relaxed">
                      <span className="text-emerald-400 mt-0.5">•</span> {item}
                    </li>
                  ))}
                  {(!results.strengths || results.strengths.length === 0) && (
                    <li className="text-white/40 text-sm">None identified.</li>
                  )}
                </ul>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-rose-500/10 to-transparent rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-rose-400 font-bold mb-6 text-xl flex items-center gap-3">
                  <FaExclamationTriangle /> Critical Improvements
                </h3>
                <ul className="space-y-5">
                  {results.criticalImprovements?.map((item, idx) => (
                    <li key={idx} className="flex flex-col gap-1.5 text-sm leading-relaxed bg-white/5 rounded-xl p-4 border border-white/5">
                      <span className="text-white/90 font-semibold"><span className="text-rose-400 font-bold">Issue:</span> {item.issue}</span>
                      <span className="text-emerald-300/90 font-medium"><span className="text-emerald-400 font-bold">Fix:</span> {item.suggestion}</span>
                    </li>
                  ))}
                  {(!results.criticalImprovements || results.criticalImprovements.length === 0) && (
                    <li className="text-white/40 text-sm">No critical flaws detected. Excellent work!</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Keywords */}
            <div className="border border-white/10 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
              <h3 className="text-amber-400 font-bold mb-5 text-xl flex items-center gap-3 relative z-10">
                <FaSearchPlus /> Missing Target Keywords
              </h3>
              <div className="flex flex-wrap gap-2.5 relative z-10">
                {results.missingKeywords?.map((keyword, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm font-medium shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    {keyword}
                  </span>
                ))}
                {(!results.missingKeywords || results.missingKeywords.length === 0) && (
                  <span className="text-white/40 font-medium">Your resume matches the target role keywords perfectly!</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formatting & Verbs */}
              <div className="border border-white/10 bg-white/5 rounded-3xl p-8 text-sm text-white/80 leading-relaxed font-medium">
                <h3 className="text-blue-400 font-bold mb-4 text-lg flex items-center gap-2">
                  <FaPenNib /> Formatting & Impact Verbs
                </h3>
                <div className="space-y-4">
                  <p><strong className="text-white">Format:</strong> {results.formatFeedback || "Looks solid."}</p>
                  <p><strong className="text-white">Action Verbs:</strong> {results.actionVerbsAdvice || "Great use of impact words."}</p>
                </div>
              </div>
              
              {/* Grammar */}
              <div className="border border-white/10 bg-white/5 rounded-3xl p-8 text-sm text-white/80 leading-relaxed font-medium">
                <h3 className="text-indigo-400 font-bold mb-4 text-lg flex items-center gap-2">
                  <FaSpellCheck /> Grammar & Typography Checks
                </h3>
                <ul className="space-y-3">
                  {results.grammarAndTypos?.map((grammar, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-indigo-400">•</span> {grammar}
                    </li>
                  ))}
                  {(!results.grammarAndTypos || results.grammarAndTypos.length === 0) && (
                    <li className="text-white/40">No major issues detected.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex justify-center pt-10 pb-6 relative z-10">
              <button
                onClick={() => { setFile(null); setResults(null); }}
                className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                Scan Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
