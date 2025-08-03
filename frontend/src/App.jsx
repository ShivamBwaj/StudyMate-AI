import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ChatPlanner from "./pages/ChatPlanner";

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat-planner" element={<ChatPlanner />} />
      </Routes>
    </div>
  );
}

export default App;
