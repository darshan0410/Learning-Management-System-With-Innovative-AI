import React, { useState } from "react";
import { FaArrowLeft, FaBrain, FaSpinner, FaCheckCircle, FaTimesCircle, FaRedo, FaListUl, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AiQuiz() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizData, setQuizData] = useState(null); // Array of questions
  
  // Quiz Running State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { 0: "Option A", 1: "Option B" }
  const [showResults, setShowResults] = useState(false);

  const generateQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to generate a quiz.");
      return;
    }
    setLoading(true);
    setError("");
    setQuizData(null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}` + "/api/interview/generate-quiz", {
        topic: topic.trim(),
        difficulty,
        numQuestions: parseInt(numQuestions)
      });
      
      if (!res.data.success) throw new Error(res.data.error || "Failed to generate quiz.");
      
      const parsedData = Array.isArray(res.data.data) ? res.data.data : JSON.parse(res.data.data);
      if (!Array.isArray(parsedData)) throw new Error("Invalid format received from AI.");

      setQuizData(parsedData);
    } catch (err) {
      setError(err.message || "Failed to fetch AI Quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    if (showResults) return; // Locked
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: option }));
  };

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    return quizData.reduce((score, q, idx) => {
      return score + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  const getScoreColor = (percent) => {
    if (percent >= 80) return "text-emerald-400";
    if (percent >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto space-y-10 z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 tracking-tight">
              AI Smart Quiz
            </h1>
            <p className="text-white/60 mt-1 text-lg">Generate dynamic, topic-specific quizzes instantly.</p>
          </div>
        </div>

        {/* Setup Screen */}
        {!quizData && (
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl animate-fade-in">
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-white/70 mb-2 font-medium">What do you want to learn about?</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. JavaScript Closures, Quantum Physics, History of Rome"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all font-medium placeholder:text-white/20"
                  disabled={loading}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2 font-medium">Difficulty</label>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-400 appearance-none disabled:opacity-50"
                    disabled={loading}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 mb-2 font-medium">Questions: {numQuestions}</label>
                  <input 
                    type="range" 
                    min="3" max="15" 
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer mt-4 accent-amber-500"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}

              <button
                onClick={generateQuiz}
                disabled={loading || !topic}
                className="w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_50px_rgba(245,158,11,0.4)]"
              >
                {loading ? (
                  <><FaSpinner className="animate-spin text-xl" /> Compiling Knowledge Base...</>
                ) : (
                  <><FaBrain /> Generate Specific Quiz</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Quiz Interface */}
        {quizData && !showResults && (
          <div className="animate-fade-in relative">
             <div className="flex justify-between items-center mb-6 px-2">
                <span className="text-white/50 font-medium tracking-wide">Question {currentIndex + 1} of {quizData.length}</span>
                <span className="px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-semibold shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                  {difficulty} Level
                </span>
             </div>

             <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-8 leading-relaxed text-white/95">
                  {quizData[currentIndex].question}
                </h2>

                <div className="space-y-4">
                  {quizData[currentIndex].options.map((opt, i) => {
                    const isSelected = selectedAnswers[currentIndex] === opt;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left px-6 py-4 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                          ? "bg-amber-500/20 border-amber-500 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.15)]" 
                          : "bg-black/30 border-white/10 hover:border-amber-500/50 hover:bg-white/5 text-white/80"
                        }`}
                      >
                        <span className="inline-block w-8 font-bold text-white/30 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!selectedAnswers[currentIndex]}
                    className="px-8 py-3 rounded-xl font-bold bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {currentIndex === quizData.length - 1 ? "Finish Quiz" : "Next Question"} <FaPlay className="text-xs" />
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* Results Screen */}
        {quizData && showResults && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-gradient-to-b from-[#0f172a] to-[#020617] border border-white/10 rounded-3xl p-10 text-center relative overflow-hidden backdrop-blur-2xl">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full" />
               <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white/70 mb-2">Your Score</h2>
                  <div className={`text-7xl font-black mb-4 ${getScoreColor((calculateScore() / quizData.length) * 100)}`}>
                    {calculateScore()}<span className="text-4xl text-white/30">/{quizData.length}</span>
                  </div>
                  <p className="text-white/60 mb-8 max-w-lg mx-auto">
                    {calculateScore() === quizData.length 
                      ? "Flawless! You demonstrate total mastery over this topic." 
                      : calculateScore() > quizData.length / 2 
                      ? "Great job! A solid understanding, but room to fine-tune."
                      : "A bit rough. Read the explanations below to solidify your knowledge."}
                  </p>
                  <button 
                    onClick={() => { setQuizData(null); setTopic(""); }}
                    className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/10 font-semibold transition-colors flex items-center gap-3 mx-auto"
                  >
                    <FaRedo /> Generate Another Quiz
                  </button>
               </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-3"><FaListUl className="text-amber-500" /> Answer Review</h3>
              {quizData.map((q, i) => {
                const userAns = selectedAnswers[i];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div key={i} className={`p-6 rounded-2xl border ${isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                    <h4 className="font-semibold text-lg mb-4 text-white/90">{i + 1}. {q.question}</h4>
                    
                    <div className="space-y-2 mb-4">
                      {q.options.map((opt, optIdx) => {
                        const isSelectedByMe = userAns === opt;
                        const isActuallyCorrect = q.correctAnswer === opt;
                        
                        let baseStyle = "px-4 py-2 rounded-xl text-sm border ";
                        if (isActuallyCorrect) baseStyle += "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
                        else if (isSelectedByMe && !isActuallyCorrect) baseStyle += "bg-rose-500/20 border-rose-500/40 text-rose-300";
                        else baseStyle += "bg-black/20 border-white/10 text-white/40";

                        return (
                          <div key={optIdx} className={baseStyle}>
                            <span className="font-bold opacity-50 mr-2">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                            {isSelectedByMe && <span className="ml-2 text-xs opacity-70">(Your Answer)</span>}
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 text-sm">
                      <strong className="text-white/80 block mb-1">Explanation:</strong>
                      <p className="text-white/60 leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
