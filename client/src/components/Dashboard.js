import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ userId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/api/tracker/report/${userId}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>🏠 Dashboard - Tổng Quan Học Tập</h2>
        <p>Chào mừng bạn đến với hệ thống AI Học Cùng Tôi!</p>
      </div>

      <div className="grid">
        <div className="stat-card">
          <h3>{stats?.totalTime || 0}</h3>
          <p>Phút học tuần này</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.sessionsCount || 0}</h3>
          <p>Buổi học hoàn thành</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.improvements?.length || 0}</h3>
          <p>Môn tiến bộ</p>
        </div>
      </div>

      {stats && (
        <div className="card">
          <h3>📊 Báo Cáo Tuần</h3>
          <div className="alert alert-success">
            {stats.message}
          </div>
          {stats.suggestion && (
            <div className="alert alert-warning">
              {stats.suggestion}
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h3>🎯 6 Module Học Tập</h3>
        <div className="grid">
          <ModuleCard 
            icon="🧠" 
            title="AI Mentor" 
            desc="Học qua phản vấn Socratic"
            link="/mentor"
          />
          <ModuleCard 
            icon="🎥" 
            title="Video Learning" 
            desc="Video tương tác thông minh"
            link="/video"
          />
          <ModuleCard 
            icon="🏆" 
            title="Challenge Mode" 
            desc="Thử thách phản biện"
            link="/challenge"
          />
          <ModuleCard 
            icon="📈" 
            title="Learning Tracker" 
            desc="Theo dõi tiến độ"
            link="/tracker"
          />
          <ModuleCard 
            icon="💪" 
            title="Health Tracker" 
            desc="Sức khỏe học tập"
            link="/health"
          />
          <ModuleCard 
            icon="🔍" 
            title="AI Reflect" 
            desc="Phản hồi thông minh"
            link="/reflect"
          />
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ icon, title, desc, link }) {
  return (
    <div className="card" style={{ cursor: 'pointer' }} onClick={() => window.location.href = link}>
      <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{icon}</h2>
      <h3>{title}</h3>
      <p style={{ color: '#666' }}>{desc}</p>
    </div>
  );
}

export default Dashboard;
