import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  FaFilePdf,
  FaImage,
  FaPaperPlane,
  FaMoon,
  FaSun,
  FaHome
} from "react-icons/fa";

function ChatPlanner() {
  const [chat, setChat] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I’m StudyMate. Ask me anything: study plans, doubts, or upload a file!",
      timestamp: new Date(),
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = userInput.trim();
    if (!message) return;

    setChat((prev) => [...prev, { role: "user", content: message, timestamp: new Date() }]);
    setUserInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://studymate-ai-tkuz.onrender.comchat", {
        message,
        history: chat.slice(-6).map((msg) => ({ role: msg.role, content: msg.content })),
      });

      setChat((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply, timestamp: new Date() }
      ]);
    } catch (err) {
      console.error("❌ Chat error:", err);
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Something went wrong.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (e, endpoint, label) => {
    const file = e.target.files[0];
    if (!file) return;

    setChat((prev) => [...prev, { role: "user", content: `${label} ${file.name}`, timestamp: new Date() }]);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setChat((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply, timestamp: new Date() }
      ]);
    } catch (err) {
      console.error("❌ File upload error:", err);
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Failed to summarize file.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div
      className={`fixed inset-0 transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"
          : "bg-gradient-to-br from-[#fff3e0] via-[#ffe0b2] to-[#ffccbc]"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 py-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
            🧠 StudyMate Chat
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            title="Toggle Theme"
          >
            {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
          </button>
        </div>

        {/* Chat Box */}
        <div className={`flex-1 overflow-y-auto rounded-xl p-4 space-y-4 shadow-lg backdrop-blur-md ${
          isDark ? "bg-white/10 text-white" : "bg-white/70 text-gray-800"
        }`}>
          {chat.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
              <div className={`inline-block px-4 py-3 rounded-2xl max-w-[85%] whitespace-pre-wrap break-words text-sm shadow ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : isDark
                    ? "bg-gray-700 text-white"
                    : "bg-orange-100 text-gray-900"
              }`}>
                {msg.role === "assistant" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                <div className="text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-gray-400">🧠 StudyMate is thinking...</div>}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex gap-2">
            <label htmlFor="pdf-upload" className="cursor-pointer bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-white text-sm flex items-center gap-1">
              <FaFilePdf /> PDF
            </label>
            <input type="file" accept=".pdf" id="pdf-upload" onChange={(e) => uploadFile(e, "https://studymate-ai-tkuz.onrender.comchat-pdf", "📎 Uploaded:")} className="hidden" />

            <label htmlFor="image-upload" className="cursor-pointer bg-pink-600 hover:bg-pink-700 p-2 rounded-lg text-white text-sm flex items-center gap-1">
              <FaImage /> Image
            </label>
            <input type="file" accept=".png,.jpg,.jpeg" id="image-upload" onChange={(e) => uploadFile(e, "https://studymate-ai-tkuz.onrender.comchat-ocr", "🖼️ Uploaded:")} className="hidden" />
          </div>

          <div className="flex-1 flex gap-2 mt-2 sm:mt-0">
            <input
              type="text"
              className={`flex-1 p-3 rounded-lg border ${
                isDark ? "bg-gray-800 text-white border-gray-700" : "bg-orange-100 border-orange-300 text-gray-800"
              } focus:outline-none`}
              placeholder="Ask me anything..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1">
              <FaPaperPlane /> Send
            </button>
          </div>
        </form>
      </div>

      {/* 🏠 Floating Home Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-white/30 transition"
        title="Go to Home"
      >
        <FaHome className="text-xl" />
      </button>
    </div>
  );
}

export default ChatPlanner;
