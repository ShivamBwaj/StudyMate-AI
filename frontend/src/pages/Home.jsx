import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaBrain, FaCalendarAlt, FaFileAlt, FaMagic, FaLinkedin, FaInstagram } from "react-icons/fa";
import { VscArrowDown } from "react-icons/vsc";
import './index.css' 

function Home() {
  const [isDark, setIsDark] = useState(true);
  const [showFooter, setShowFooter] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);

    const onScroll = () => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
          setShowFooter(true);
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDark]);

  const handleStartClick = () => {
    setTimeout(() => setShowFooter(true), 1500);
  };

  return (
    <div
      className={`transition-all duration-500 min-h-screen ${
        isDark
          ? "bg-gradient-to-br from-[#140f3d] via-[#3a2059] to-[#24243e]"
          : "bg-gradient-to-br from-[#fd6363] via-[#ddaff8] to-[#5cccf2]"
      }`}
    >
      {/* Sparkle Effect */}
      <div className="sparkle">
        {[...Array(30)].map((_, i) => (
          <span key={i} style={{ left: `${Math.random() * 100}%`, animationDelay: `${i * 0.3}s` }}></span>
        ))}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        title="Toggle Theme"
        className="fixed bottom-4 right-4 z-50 bg-white/30 dark:bg-white/10 text-gray-900 dark:text-white p-3 rounded-full hover:scale-105 transition backdrop-blur"
      >
        {isDark ? "🌞" : "🌙"}
      </button>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 text-center text-gray-900 dark:text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 drop-shadow-lg">
          Your AI Study Companion
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl text-gray-700 dark:text-gray-300">
          Plans, summaries, doubts — just ask. Upload your notes, set your goals, and let StudyMate guide your journey.
        </p>
        <Link
          to="/chat-planner"
          onClick={handleStartClick}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition"
        >
          <FaRocket /> Get Started
        </Link>
        {/* Demo */}
        <div className="mt-16 p-6 rounded-2xl bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-2xl max-w-lg w-full text-left border border-white/20">
          <div className="font-semibold text-purple-700 dark:text-purple-300">🧑 You:</div>
          <div className="mt-2">I want to study OS & DBMS in 7 days. Make me a plan.</div>
          <div className="mt-4 font-semibold text-pink-700 dark:text-pink-300">🤖 StudyMate:</div>
          <div className="mt-2">Sure! Here's a 7-day plan for Operating Systems and DBMS with 4 hours/day...</div>
        </div>
      </div>

      <center>
        <VscArrowDown size={80} />
      </center>

      {/* Features */}
      <div className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">✨ What StudyMate Can Do</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={<FaBrain className="text-3xl text-purple-500" />} title="Smart Study Plans" desc="Tell StudyMate your goals, schedule, or subjects. It will craft the perfect daily plan for you." />
          <FeatureCard icon={<FaFileAlt className="text-3xl text-pink-500" />} title="PDF & Image Q&A" desc="Upload handwritten notes, slides, or PDFs. Ask questions directly from your content." />
          <FeatureCard icon={<FaCalendarAlt className="text-3xl text-blue-500" />} title="Calendar Integration" desc="Automatically sync your study schedule with Google Calendar. Stay consistent." />
          <FeatureCard icon={<FaMagic className="text-3xl text-yellow-500" />} title="AI Memory" desc="Soon: Let StudyMate remember your past chats, uploads, and preferences." />
        </div>
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className={`transition-all duration-700 ${showFooter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} flex flex-col items-center py-10`}
      >
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Made with ❤️ by Shivam Bhardwaj</p>
        <div className="flex gap-4">
          <a href="https://www.linkedin.com/in/shivam-bhardwaj-118548377/" target="_blank" rel="noreferrer">
            <FaLinkedin size={24} />
          </a>
          <a href="https://www.instagram.com/shivamisticz/" target="_blank" rel="noreferrer">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/30 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-[1.03] transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm">{desc}</p>
    </div>
  );
}

export default Home;
