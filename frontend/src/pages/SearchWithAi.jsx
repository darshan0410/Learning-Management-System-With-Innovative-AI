import React, { useState, useRef } from 'react'
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import start from "../assets/start.mp3"
import { FaArrowLeftLong } from "react-icons/fa6";
function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false)
  const [micError, setMicError] = useState('')
  const navigate = useNavigate();
  const startSound = useRef(new Audio(start))
  const recognitionRef = useRef(null)

  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

  const getRecognition = () => {
    if (!SpeechRecognitionApi) return null
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionApi();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;
    }
    return recognitionRef.current;
  }

  const handleSearch = async () => {
    const recognition = getRecognition();

    if (!recognition) {
      setMicError("Voice search isn't supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (listening) return; // already listening, avoid double start

    setMicError('')
    setListening(true)
    startSound.current.play().catch(() => { })

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      setListening(false)
      await handleRecommendation(transcript);
    };

    recognition.onerror = (e) => {
      console.log("Speech recognition error:", e.error);
      setListening(false)
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setMicError("Mic access was blocked. Please allow microphone permission and try again.");
      } else if (e.error === 'no-speech') {
        setMicError("Didn't catch that. Try speaking again.");
      } else {
        setMicError("Something went wrong with voice search. Please try again.");
      }
    };

    recognition.onend = () => {
      setListening(false)
    };

    try {
      recognition.start();
    } catch (err) {
      console.log("Recognition start error:", err);
      setListening(false)
      setMicError("Voice search couldn't start. Please try again.");
    }
  };

  const handleRecommendation = async (query) => {
    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: query }, { withCredentials: true });
      setRecommendations(result.data);
      if (result.data.length > 0) {
        speak("These are the top courses I found for you")
      } else {
        speak("No courses found")
      }

      setListening(false)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-white flex flex-col items-center px-4 py-16 relative overflow-hidden">

      {/* ambient background glow, matches site theme */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[420px] h-[420px] bg-orange-400/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Search Container */}
      <div className="relative z-[1] bg-[#0f0f18] border border-orange-500/15 shadow-[0_0_35px_rgba(249,115,22,0.08)] rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center">
        <button
          onClick={() => navigate("/")}
          className="absolute left-6 top-6 sm:left-8 sm:top-8 w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:scale-105 transition"
        >
          <FaArrowLeftLong className='text-black text-sm' />
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-6 flex items-center justify-center gap-2">
          <img src={ai} className='w-8 h-8 sm:w-[30px] sm:h-[30px]' alt="AI" />
          Search with <span className='text-orange-400'>AI</span>
        </h1>

        <div className="flex items-center bg-[#15151f] border border-orange-500/10 rounded-full overflow-hidden shadow-inner relative w-full">

          <input
            type="text"
            className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base"
            placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />


          {input && (
            <button
              onClick={() => handleRecommendation(input)}
              className="absolute right-14 sm:right-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.4)]"
            >
              <img src={ai} className='w-10 h-10 p-2 rounded-full' alt="Search" />
            </button>
          )}

          <button
            className="absolute right-2 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full w-10 h-10 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.4)] hover:brightness-110 transition"
            onClick={handleSearch}
          >
            <RiMicAiFill className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="relative z-[1] w-full max-w-6xl mt-12 px-2 sm:px-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-100 text-center flex items-center justify-center gap-3">
            <img src={ai1} className="w-10 h-10 sm:w-[60px] sm:h-[60px] p-2 rounded-full" alt="AI Results" />
            AI Search Results
          </h2>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {recommendations.map((course, index) => (
              <div
                key={index}
                className="bg-[#0f0f18] border border-orange-500/15 text-gray-100 p-5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.2)] hover:border-orange-500/40 transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/viewcourse/${course._id}`)}
              >
                <h3 className="text-lg font-bold sm:text-xl">{course.title}</h3>
                <p className="text-sm text-orange-400/80 mt-1">{course.category}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-[1]">
          {listening
            ? <h1 className='text-center text-xl sm:text-2xl mt-10 text-orange-300 animate-pulse'>Listening...</h1>
            : <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-500'>No Courses Found</h1>}
        </div>
      )}
    </div>
  );
}

export default SearchWithAi;