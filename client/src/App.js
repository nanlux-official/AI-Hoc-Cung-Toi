import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import AIMentorV4 from './components/AIMentorV4';
import AIReflect from './components/AIReflect';
import ChallengeMode from './components/ChallengeMode';
import LearningTracker from './components/LearningTracker';
import VideoLearning from './components/VideoLearning';
import HealthTracker from './components/HealthTracker';
import Dashboard from './components/Dashboard';

function App() {
  const [userId] = useState('user123'); // Trong thực tế có authentication

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>🎓 AI Học Cùng Tôi</h1>
          </div>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/mentor">AI Mentor</Link>
            <Link to="/video">Video Learning</Link>
            <Link to="/challenge">Challenge</Link>
            <Link to="/tracker">Tiến Độ</Link>
            <Link to="/health">Sức Khỏe</Link>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard userId={userId} />} />
            <Route path="/mentor" element={<AIMentorV4 userId={userId} />} />
            <Route path="/reflect" element={<AIReflect userId={userId} />} />
            <Route path="/challenge" element={<ChallengeMode userId={userId} />} />
            <Route path="/tracker" element={<LearningTracker userId={userId} />} />
            <Route path="/video" element={<VideoLearning userId={userId} />} />
            <Route path="/health" element={<HealthTracker userId={userId} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
