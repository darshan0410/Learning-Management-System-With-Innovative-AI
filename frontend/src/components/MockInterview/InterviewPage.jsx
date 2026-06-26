/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
// src/components/MockInterview/InterviewPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "regenerator-runtime/runtime";
import { FaMicrophone, FaStop, FaArrowLeft, FaDownload } from "react-icons/fa";
import aiAvatar from "../../assets/ai_interviewer.png";
import "./MockInterview.css";

const TIMER_SECONDS = 60;

const InterviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { questions: initQuestions, role, experience, difficulty } = location.state || {};

  // Redirect if no questions passed
  useEffect(() => {
    if (!initQuestions || initQuestions.length === 0) navigate("/");
  }, [initQuestions, navigate]);

  const [phase, setPhase] = useState("interviewing"); // interviewing | completed
  const [questions] = useState(initQuestions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(initQuestions?.[0] || "");
  const [feedbackList, setFeedbackList] = useState([]);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Cheating alert states
  const [cheatWarnings, setCheatWarnings] = useState(0);
  const [showCheatAlert, setShowCheatAlert] = useState(false);

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [micPrompt, setMicPrompt] = useState(false);

  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // ── Speech Recognition using vanilla Web Speech API ──
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef(null);
  const wantListeningRef = useRef(false);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      recognitionRef.current = new SpeechRec();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = navigator.language || 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalStr = "";
        let interimStr = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }
        if (finalStr) {
          setInput((prev) => prev + (prev ? " " : "") + finalStr.trim());
        }
        setInterimText(interimStr);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          wantListeningRef.current = false;
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        if (wantListeningRef.current) {
          try { recognitionRef.current.start(); } catch (e) {}
        } else {
          setIsListening(false);
          setInterimText("");
        }
      };
    }
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported here. Use Chrome or Edge browsers.");
      return;
    }
    wantListeningRef.current = true;
    setMicPrompt(false);
    setIsListening(true);
    setInterimText("");
    try { recognitionRef.current.start(); } catch(e){}
  };

  const stopListening = () => {
    wantListeningRef.current = false;
    setIsListening(false);
    setInterimText("");
    try { recognitionRef.current.stop(); } catch(e){}
  };

  const toggleListening = () => {
    if (aiSpeaking) { synthRef.current?.cancel(); setAiSpeaking(false); return; }
    if (isListening) stopListening();
    else startListening();
  };

  // ── TTS ──
  const speakQuestion = (text) => {
    synthRef.current?.cancel();
    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; utterance.rate = 0.9; utterance.pitch = 1.05; utterance.volume = 1;
      const voices = synthRef.current.getVoices();
      const preferred = voices.find((v) => /zira|susan|samantha|karen|victoria|female|google us english/i.test(v.name));
      if (preferred) utterance.voice = preferred;
      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => {
        setAiSpeaking(false);
        wantListeningRef.current = true;
        setTimeout(() => startListening(), 300);
      };
      utterance.onerror = () => setAiSpeaking(false);
      synthRef.current.speak(utterance);
    };
    if (synthRef.current.getVoices().length > 0) doSpeak();
    else synthRef.current.addEventListener("voiceschanged", doSpeak, { once: true });
  };

  // ── Timer ──
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Speak first question on mount
  useEffect(() => {
    if (questions.length > 0) {
      startTimer();
      setTimeout(() => {
        speakQuestion(`Hello! I'm your AI Interviewer today. Let's begin. Here is your first question. ${questions[0]}`);
      }, 600);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (phase !== "interviewing") {
      clearInterval(timerRef.current);
      synthRef.current?.cancel();
      stopListening();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
    return () => clearInterval(timerRef.current);
  }, [phase]); // eslint-disable-line

  // ── Webcam & Cheating Detection Effect ──
  useEffect(() => {
    if (phase !== "interviewing") return;

    let model = null;
    let detectInterval = null;

    // 1. Initialize Webcam
    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
      .then(async (stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        try {
          await tf.setBackend('webgl').catch(async () => await tf.setBackend('cpu'));
          await tf.ready();
          model = await cocoSsd.load(); // Load default robust model
          console.log("COCO-SSD Model Loaded successfully!");
          let lastSeenTime = Date.now();

          detectInterval = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState >= 2 && model) {
              try {
                const predictions = await model.detect(videoRef.current);
                const detectedClasses = predictions.map(p => p.class);

                // 1. Check for absence
                if (detectedClasses.includes("person")) {
                  lastSeenTime = Date.now();
                } else {
                  if (Date.now() - lastSeenTime > 5000) {
                    setCheatWarnings((prev) => prev + 1);
                    setShowCheatAlert(true);

                    if (synthRef.current) {
                      synthRef.current.cancel();
                      const utterance = new SpeechSynthesisUtterance("Warning. You have been away from the screen for too long. Please return to your seat immediately.");
                      utterance.lang = "en-US";
                      utterance.rate = 0.95;
                      const voices = synthRef.current.getVoices();
                      const preferred = voices.find((v) => /zira|susan|samantha|karen|victoria|female|google us english/i.test(v.name));
                      if (preferred) utterance.voice = preferred;
                      synthRef.current.speak(utterance);
                    }
                    lastSeenTime = Date.now(); // reset to avoid spam
                  }
                }

                if (detectedClasses.length > 0 && !detectedClasses.includes("person")) {
                  console.log("Detected:", detectedClasses);
                }

                // Treat laptops and monitors as fine since they are doing the interview on it,
                // but cell phone, book, tablet, or remote as cheating.
                const forbidden = predictions.filter(p => ["cell phone", "book", "remote", "tablet", "tv"].includes(p.class));

                if (forbidden.length > 0) {
                  const detectedItem = forbidden[0].class;
                  setCheatWarnings((prev) => prev + 1);
                  setShowCheatAlert(true);

                  if (synthRef.current) {
                    synthRef.current.cancel();
                    const utterance = new SpeechSynthesisUtterance(`Warning. Suspicious object detected. ${detectedItem} found in camera view. Please remove it immediately.`);
                    utterance.lang = "en-US";
                    utterance.rate = 0.95;
                    const voices = synthRef.current.getVoices();
                    const preferred = voices.find((v) => /zira|susan|samantha|karen|victoria|female|google us english/i.test(v.name));
                    if (preferred) utterance.voice = preferred;
                    synthRef.current.speak(utterance);
                  }
                }
              } catch (detectErr) {
                console.error("Detection error:", detectErr);
              }
            }
          }, 1500); // Check more frequently (every 1.5 seconds)
        } catch (err) {
          console.error("TF load error", err);
        }
      })
      .catch((err) => {
        console.error("Camera access denied or failed.", err);
        setCheatWarnings((prev) => prev + 1);
        alert("Camera access is required for proctoring the interview. Refusing access will affect your integrity score.");
      });

    const triggerCheatingAlert = () => {
      setCheatWarnings((prev) => prev + 1);
      setShowCheatAlert(true);

      // Voice Alert
      if (synthRef.current) {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance("Warning. Suspicious activity detected. Please do not leave the interview page.");
        utterance.lang = "en-US";
        utterance.rate = 0.95;
        const voices = synthRef.current.getVoices();
        const preferred = voices.find((v) => /zira|susan|samantha|karen|victoria|female|google us english/i.test(v.name));
        if (preferred) utterance.voice = preferred;
        synthRef.current.speak(utterance);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) triggerCheatingAlert();
    };

    const handleWindowBlur = () => triggerCheatingAlert();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      if (detectInterval) clearInterval(detectInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [phase]);

  // ── Submit Answer ──
  const submitAnswer = async () => {
    // Merge interim text in case the user speaks and immediately hits submit
    const combinedVal = input + (interimText ? " " + interimText : "");
    const answerText = combinedVal.trim();

    if (!answerText || loading) return;

    synthRef.current?.cancel();
    stopListening();
    setAiSpeaking(false);
    setInput("");
    setLoading(true);
    clearInterval(timerRef.current);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}` + "/api/interview/submit-answer", {
        question: currentQuestion, answer: answerText,
      });
      const data = response.data.data;
      setFeedbackList((prev) => [...prev, { question: currentQuestion, answer: answerText, ...data }]);
      setCurrentFeedback(data);
      const feedbackSnippet = data.feedback || "Good answer.";
      setTimeout(() => speakQuestion(feedbackSnippet), 300);
    } catch { alert("Network error while evaluating answer."); }
    setLoading(false);
  };

  // ── Next Question ──
  const goToNextQuestion = () => {
    synthRef.current?.cancel();
    stopListening();
    setCurrentFeedback(null);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      startTimer();
      setTimeout(() => speakQuestion(`Question ${nextIndex + 1}. ${questions[nextIndex]}`), 400);
    } else {
      // Save to history
      const allFeedback = [...feedbackList];
      const avgScore = allFeedback.length
        ? (allFeedback.reduce((s, f) => s + (f.finalScore || 0), 0) / allFeedback.length).toFixed(1) : "0";

      if (userData?._id) {
        axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}` + "/api/interview/save-history", {
          userId: userData._id,
          role, experience, difficulty,
          feedbackList: allFeedback,
          cheatWarnings,
          avgScore
        }).catch(err => console.error("History save error:", err));
      }

      setTimeout(() => speakQuestion("That concludes our interview. You did great! Thank you for your time."), 400);
      setPhase("completed");
    }
  };

  // ── End Interview Early ──
  const handleEndInterview = () => {
    synthRef.current?.cancel();
    stopListening();
    if (feedbackList.length > 0) {
      const allFeedback = [...feedbackList];
      const avgScore = allFeedback.length
        ? (allFeedback.reduce((s, f) => s + (f.finalScore || 0), 0) / allFeedback.length).toFixed(1) : "0";

      if (userData?._id) {
        axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}` + "/api/interview/save-history", {
          userId: userData._id,
          role, experience, difficulty,
          feedbackList: allFeedback,
          cheatWarnings,
          avgScore
        }).catch(err => console.error("History save error:", err));
      }

      setPhase("completed");
    } else {
      navigate("/mockinterview/history");
    }
  };

  // ── Auto-Terminate on Extreme Cheating ──
  useEffect(() => {
    if (cheatWarnings >= 5 && phase === "interviewing") {
      setShowCheatAlert(false);
      synthRef.current?.cancel();
      const utterance = new SpeechSynthesisUtterance("Maximum cheating threshold reached. The interview is now terminated.");
      utterance.lang = "en-US";
      synthRef.current?.speak(utterance);
      
      alert("Maximum cheating warnings reached (5/5). Your session has been automatically terminated.");
      handleEndInterview();
    }
  }, [cheatWarnings, phase]); // eslint-disable-line


  // Timer ring
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / TIMER_SECONDS) * circumference;
  const statusLabel = aiSpeaking ? "AI Speaking" : isListening ? "Listening..." : loading ? "Evaluating..." : "Waiting";
  const statusColor = aiSpeaking ? "#3b82f6" : isListening ? "#22c55e" : loading ? "#f59e0b" : "#94a3b8";

  // ── PDF Download ──
  const downloadPDF = () => {
    const avg = (arr, key) => arr.length ? (arr.reduce((s, f) => s + (f[key] || 0), 0) / arr.length).toFixed(1) : "0";
    const avgScore = avg(feedbackList, "finalScore");
    const avgConf = avg(feedbackList, "confidence");
    const avgComm = avg(feedbackList, "communication");
    const avgCorr = avg(feedbackList, "correctness");
    const scoreNum = parseFloat(avgScore);
    const advice = scoreNum >= 8 ? "Excellent performance! You demonstrated strong technical knowledge and communication skills."
      : scoreNum >= 6 ? "Good performance. Focus on providing more structured and detailed answers."
        : scoreNum >= 4 ? "Average performance. Work on clarity, confidence, and providing specific examples."
          : "Significant improvement required. Focus on structured thinking, clarity, and confident delivery.";
    const rows = feedbackList.map((f, i) => `<tr><td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#334155;width:40px;vertical-align:top">${i + 1}</td><td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#334155;width:240px;vertical-align:top;line-height:1.5">${f.question}</td><td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#0f172a;text-align:center;vertical-align:top">${f.finalScore}/10</td><td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#475569;line-height:1.5;vertical-align:top">${f.feedback}</td></tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>AI Interview Report</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',system-ui,sans-serif;padding:50px;color:#0f172a;background:white}@media print{body{padding:30px}}</style></head><body><h1 style="text-align:center;font-size:1.8rem;font-weight:800;color:#22c55e;margin-bottom:6px">AI Interview Performance Report</h1><hr style="border:none;height:3px;background:linear-gradient(90deg,#22c55e,#0d9488);border-radius:2px;margin-bottom:32px"/><div style="background:#f0fdf4;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px"><p style="font-size:1.4rem;font-weight:800;color:#0f172a">Final Score: ${avgScore}/10</p></div><div style="border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:24px"><p style="font-size:1rem;margin-bottom:10px"><strong>Tab Switches (Warnings):</strong> <span style="color:${cheatWarnings > 0 ? '#ef4444' : '#22c55e'}; font-weight:bold">${cheatWarnings}</span></p><p style="font-size:1rem;margin-bottom:10px"><strong>Confidence:</strong> ${avgConf}</p><p style="font-size:1rem;margin-bottom:10px"><strong>Communication:</strong> ${avgComm}</p><p style="font-size:1rem"><strong>Correctness:</strong> ${avgCorr}</p></div><div style="border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:32px"><p style="font-size:1.1rem;font-weight:700;margin-bottom:10px">Professional Advice</p><p style="font-size:0.95rem;color:#475569;line-height:1.6">${advice}</p></div><table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0"><thead><tr style="background:#22c55e;color:white"><th style="padding:14px 16px;text-align:left;font-size:0.85rem;font-weight:700">#</th><th style="padding:14px 16px;text-align:left;font-size:0.85rem;font-weight:700">Question</th><th style="padding:14px 16px;text-align:center;font-size:0.85rem;font-weight:700">Score</th><th style="padding:14px 16px;text-align:left;font-size:0.85rem;font-weight:700">Feedback</th></tr></thead><tbody>${rows}</tbody></table><p style="text-align:center;margin-top:32px;font-size:0.8rem;color:#94a3b8">Generated by AI Smart Interview Platform • ${new Date().toLocaleDateString()}</p></body></html>`;
    const win = window.open("", "_blank"); win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500);
  };

  if (!questions || questions.length === 0) return null;

  // ── COMPLETED DASHBOARD ──
  if (phase === "completed") {
    const avgScore = feedbackList.length ? (feedbackList.reduce((s, f) => s + (f.finalScore || 0), 0) / feedbackList.length).toFixed(1) : 0;
    const avgConf = feedbackList.length ? (feedbackList.reduce((s, f) => s + (f.confidence || 0), 0) / feedbackList.length).toFixed(1) : 0;
    const avgComm = feedbackList.length ? (feedbackList.reduce((s, f) => s + (f.communication || 0), 0) / feedbackList.length).toFixed(1) : 0;
    const avgCorr = feedbackList.length ? (feedbackList.reduce((s, f) => s + (f.correctness || 0), 0) / feedbackList.length).toFixed(1) : 0;
    const scoreNum = parseFloat(avgScore);
    const r = 60; const c = 2 * Math.PI * r; const p = (scoreNum / 10) * c;
    const ratingText = scoreNum >= 8 ? "Excellent performance!" : scoreNum >= 6 ? "Good performance. Keep improving." : scoreNum >= 4 ? "Average. Work on clarity and confidence." : "Significant improvement required.";
    const scores = feedbackList.map((f) => f.finalScore || 0);
    const chartW = 400; const chartH = 160; const padX = 40; const padY = 20;
    const usableW = chartW - padX * 2; const usableH = chartH - padY * 2;
    const pts = scores.map((s, i) => ({ x: padX + (scores.length > 1 ? (i / (scores.length - 1)) * usableW : usableW / 2), y: padY + usableH - (s / 10) * usableH }));
    const line = pts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
    const area = line + ` L${pts[pts.length - 1]?.x || padX},${chartH - padY} L${padX},${chartH - padY} Z`;

    return (
      <div className="mi-container">
        <div className="iv-dashboard fade-in" id="interview-report">
          <div className="dash-header">
            <div className="dash-header-left">
              <button className="dash-back" onClick={() => navigate("/mockinterview/history")}><FaArrowLeft /></button>
              <div>
                <h2 className="dash-title">Interview Analytics Dashboard</h2>
                <p className="dash-subtitle">AI-powered performance insights</p>
              </div>
            </div>
            <button className="dash-pdf-btn" onClick={downloadPDF}><FaDownload size={14} /> Download PDF</button>
          </div>
          <div className="dash-grid-2">
            <div className="dash-card">
              <p className="dash-card-title">Overall Performance</p>
              <div className="dash-donut-wrap">
                <svg width="150" height="150" viewBox="0 0 150 150"><circle cx="75" cy="75" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" /><circle cx="75" cy="75" r={r} fill="none" stroke="#22c55e" strokeWidth="10" strokeDasharray={c} strokeDashoffset={c - p} strokeLinecap="round" transform="rotate(-90 75 75)" style={{ transition: "stroke-dashoffset 1s ease" }} /></svg>
                <span className="dash-donut-score">{avgScore}</span>
              </div>
              <p className="dash-donut-sub">Out of 10</p>
              <p className="dash-rating"><strong>{ratingText.split(".")[0]}.</strong> {ratingText.split(".").slice(1).join(".")}</p>
            </div>
            <div className="dash-card">
              <p className="dash-card-title">Performance Trend</p>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="dash-chart">
                {[0, 3, 5, 7, 10].map((v) => { const y = padY + usableH - (v / 10) * usableH; return <g key={v}><line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="#f1f5f9" /><text x={padX - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="11">{v}</text></g>; })}
                <path d={area} fill="rgba(34,197,94,0.1)" /><path d={line} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round" />
                {pts.map((pt, i) => (<g key={i}><circle cx={pt.x} cy={pt.y} r="4" fill="#22c55e" /><text x={pt.x} y={chartH - 4} textAnchor="middle" fill="#94a3b8" fontSize="11">Q{i + 1}</text></g>))}
              </svg>
            </div>
          </div>
          <div className="dash-grid-2">
            <div className="dash-card">
              <p className="dash-card-title">Skill Evaluation</p>
              {[{ label: "Confidence", value: avgConf }, { label: "Communication", value: avgComm }, { label: "Correctness", value: avgCorr }].map((s) => (
                <div key={s.label} className="dash-skill-row"><div className="dash-skill-head"><span>{s.label}</span><span className="dash-skill-val">{s.value}</span></div><div className="dash-bar-bg"><div className="dash-bar-fill" style={{ width: `${(s.value / 10) * 100}%` }} /></div></div>
              ))}
              <div className="dash-skill-row" style={{ marginTop: "24px" }}>
                <div className="dash-skill-head" style={{ color: cheatWarnings > 0 ? "#ef4444" : "#64748b", fontWeight: "600" }}>
                  <span>Integrity Warnings (Tab Switches)</span>
                  <span className="dash-skill-val">{cheatWarnings}</span>
                </div>
              </div>
            </div>
            <div className="dash-card dash-card-scroll">
              <p className="dash-card-title">Question Breakdown</p>
              {feedbackList.map((f, i) => (
                <div key={i} className="dash-q-card"><div className="dash-q-header"><span className="dash-q-label">Question {i + 1}</span><span className={`dash-q-score ${f.finalScore >= 7 ? "good" : f.finalScore >= 4 ? "ok" : "low"}`}>{f.finalScore} / 10</span></div><p className="dash-q-text">{f.question}</p><div className="dash-q-fb"><span className="dash-q-fb-label">AI Feedback</span><p>{f.feedback}</p></div></div>
              ))}
            </div>
          </div>
          <button className="setup-start-btn green-btn" style={{ maxWidth: "320px", marginTop: "24px" }} onClick={() => navigate("/mockinterview/history")}>View All History</button>
        </div>
      </div>
    );
  }

  // ── INTERVIEWING ──
  return (
    <div className="mi-container">
      {/* Cheating Alert Overlay */}
      {showCheatAlert && (
        <div className="cheat-alert-overlay fade-in">
          <div className="cheat-alert-box fade-in">
            <h2 className="cheat-title">⚠️ Warning: Activity Detected</h2>
            <p className="cheat-desc">
              Please do not switch tabs, minimize the window, or leave the page during the interview to maintain integrity.
            </p>
            <p className="cheat-count">Warnings recorded: <strong>{cheatWarnings}</strong></p>
            {cheatWarnings >= 3 && (
              <p className="cheat-fail-text">Repeated violations may severely impact your final evaluation.</p>
            )}
            <button className="cheat-ack-btn" onClick={() => setShowCheatAlert(false)}>
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <div className="iv-top-nav fade-in">
        <div className="iv-top-item">
          <span className="iv-status-label" style={{ marginRight: 4 }}>Status:</span>
          <span className="iv-speaking-badge" style={{ color: statusColor }}>
            <span className="iv-dot" style={{ background: statusColor }} /> {statusLabel}
          </span>
        </div>
        <div className="iv-top-item iv-top-timer-display" style={{ color: timeLeft < 15 ? "#ef4444" : "#22c55e" }}>
          <svg width="24" height="24" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle cx="36" cy="36" r={radius} fill="none" stroke={timeLeft < 15 ? "#ef4444" : "#22c55e"} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" transform="rotate(-90 36 36)" style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          {timeLeft}s
        </div>
        <div className="iv-top-item">
          Question {currentQuestionIndex + 1} / {questions.length}
        </div>
        <button className="iv-end-btn" onClick={handleEndInterview}>End Interview</button>
      </div>

      <div className="iv-shell fade-in" style={{ paddingTop: 0 }}>
        <div className="iv-left">
          <div className="iv-avatar-card">
            <img src={aiAvatar} alt="AI Interviewer" className={`iv-avatar-img ${aiSpeaking ? "speaking-pulse" : ""}`} />
            <div className="iv-greeting">
              {aiSpeaking ? <span className="iv-speaking-text"><span className="dot-anim" />Speaking...</span>
                : isListening ? <span style={{ color: "#22c55e", fontWeight: 600 }}>🎤 Listening to you...</span>
                  : "Hi there, I hope you're feeling confident and ready."}
            </div>
          </div>

          <div className="iv-user-cam-wrap">
            <video ref={videoRef} autoPlay playsInline muted className="iv-user-cam" />
            <div className="iv-cam-label">
              <span className="rec-dot"></span> PROCTORING ACTIVE
            </div>
          </div>
        </div>

        <div className="iv-right">
          <div className="iv-right-header">
            <h2 className="iv-title" style={{ marginBottom: "16px" }}>AI Smart Interview</h2>
          </div>
          <div className="iv-question-box">{currentQuestion}</div>
          <textarea
            className="iv-answer-area"
            placeholder={
              isListening ? "Speak now — your words appear here..."
                : "Type your answer or press mic to speak..."
            }
            value={isListening ? `${input}${input && interimText ? ' ' : ''}${interimText}` : input}
            onChange={(e) => {
              // Allow typing while listening, but subtract the interim visually if they somehow manage to append
              setInput(e.target.value);
            }}
            disabled={!!currentFeedback} />
          {!currentFeedback && (
            <>
              <div className="iv-bottom-row">
                <button className={`iv-mic-btn ${isListening ? "listening" : aiSpeaking ? "ai-speaking" : micPrompt ? "mic-prompt-pulse" : ""}`} onClick={toggleListening} title={aiSpeaking ? "Stop AI speaking" : isListening ? "Stop listening" : "Start voice input"}>
                  {isListening ? <FaStop size={16} /> : <FaMicrophone size={18} />}
                </button>
                <button className="iv-submit-btn" onClick={submitAnswer} disabled={loading || !(input.trim() || interimText.trim())}>
                  {loading ? "Evaluating..." : "Submit Answer"}
                </button>
              </div>
              {micPrompt && !isListening && <p className="iv-mic-prompt">👆 Click the mic button to start speaking your answer</p>}
            </>
          )}
          {currentFeedback && (
            <div className="iv-inline-feedback fade-in">
              <p className="iv-inline-fb-text">{currentFeedback.feedback}</p>
              <button className="iv-next-btn" onClick={goToNextQuestion}>
                {currentQuestionIndex + 1 >= questions.length ? "View Results →" : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;