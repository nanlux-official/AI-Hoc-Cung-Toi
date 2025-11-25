import React, { useState, useEffect } from 'react';

function Dashboard({ userId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    // Mock data vì đã xóa tracker API
    setStats({
      totalTime: 120,
      sessionsCount: 8,
      improvements: ['Toán', 'Hóa học'],
      message: 'Bạn đã học tập rất chăm chỉ tuần này! Tiếp tục phát huy nhé! 🎉',
      suggestion: 'Hãy thử sử dụng AI Mentor V4 để cải thiện kỹ năng tư duy phản biện.'
    });
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
        <h3>🎯 4 Module Học Tập</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <ModuleCard 
            icon="🧠" 
            title="AI Mentor V4" 
            desc="Học qua phương pháp Socratic với 4 cấp gợi ý"
            link="/mentor"
          />
          <ModuleCard 
            icon="🎥" 
            title="Video Learning" 
            desc="Video tương tác thông minh"
            link="/video"
          />
          <ModuleCard 
            icon="💪" 
            title="Health Tracker" 
            desc="Sức khỏe và tập trung học tập"
            link="/health"
          />
          <ModuleCard 
            icon="📊" 
            title="Dashboard" 
            desc="Tổng quan và thống kê"
            link="/"
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
