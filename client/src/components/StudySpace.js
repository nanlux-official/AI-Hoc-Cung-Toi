import { useState, useEffect } from 'react';
import { 
  Clock, Calendar, BookOpen, Coffee, Target, 
  Plus, X, Play, Pause, RotateCcw, Wind, Dumbbell,
  Heart, Brain
} from 'lucide-react';
import AIMentorV4 from './AIMentorV4';
import HealthTracker from './HealthTracker';
import MentalHealthMentor from './MentalHealthMentor';

// Cấu hình môn học
const SUBJECTS = {
  math: { name: 'Toán', color: 'bg-blue-500', lightColor: 'bg-blue-100' },
  phys: { name: 'Vật Lý', color: 'bg-purple-500', lightColor: 'bg-purple-100' },
  chem: { name: 'Hóa Học', color: 'bg-green-500', lightColor: 'bg-green-100' },
  bio: { name: 'Sinh Học', color: 'bg-teal-500', lightColor: 'bg-teal-100' },
  eng: { name: 'Tiếng Anh', color: 'bg-orange-500', lightColor: 'bg-orange-100' },
  lit: { name: 'Ngữ Văn', color: 'bg-pink-500', lightColor: 'bg-pink-100' },
  hist: { name: 'Lịch Sử', color: 'bg-yellow-500', lightColor: 'bg-yellow-100' },
  geo: { name: 'Địa Lý', color: 'bg-cyan-500', lightColor: 'bg-cyan-100' },
  civic: { name: 'GDCD', color: 'bg-indigo-500', lightColor: 'bg-indigo-100' },
  tech: { name: 'Tin Học', color: 'bg-slate-500', lightColor: 'bg-slate-100' }
};

const ACTIVITIES = {
  new: 'Học mới',
  ex: 'Luyện tập',
  test: 'Kiểm tra'
};

const MOODS = ['😢', '😐', '🙂', '😄'];

function StudySpace() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dailyLogs, setDailyLogs] = useState(() => {
    const saved = localStorage.getItem('studyLogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('studySchedule');
    return saved ? JSON.parse(saved) : {};
  });
  const [subjectTargets, setSubjectTargets] = useState(() => {
    const saved = localStorage.getItem('subjectTargets');
    return saved ? JSON.parse(saved) : {};
  });
  const [globalTime, setGlobalTime] = useState(() => {
    const saved = localStorage.getItem('globalTime');
    return saved ? parseInt(saved) : 0;
  });
  const [isGlobalRunning, setIsGlobalRunning] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('studyLogs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('studySchedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('subjectTargets', JSON.stringify(subjectTargets));
  }, [subjectTargets]);

  useEffect(() => {
    localStorage.setItem('globalTime', globalTime.toString());
  }, [globalTime]);

  // Global Timer
  useEffect(() => {
    let interval;
    if (isGlobalRunning) {
      interval = setInterval(() => {
        setGlobalTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGlobalRunning]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          globalTime={globalTime}
          isGlobalRunning={isGlobalRunning}
          setIsGlobalRunning={setIsGlobalRunning}
          formatTime={formatTime}
        />

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Header />
          
          {activeTab === 'dashboard' && (
            <DashboardView 
              dailyLogs={dailyLogs}
              subjectTargets={subjectTargets}
              setSubjectTargets={setSubjectTargets}
            />
          )}
          
          {activeTab === 'scheduler' && (
            <SchedulerView 
              schedule={schedule}
              setSchedule={setSchedule}
            />
          )}
          
          {activeTab === 'dailylog' && (
            <DailyLogView 
              dailyLogs={dailyLogs}
              setDailyLogs={setDailyLogs}
            />
          )}
          
          {activeTab === 'pomodoro' && (
            <PomodoroView />
          )}
          
          {activeTab === 'relax' && (
            <RelaxZoneView />
          )}
          
          {activeTab === 'mentor' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ minHeight: '80vh' }}>
              <AIMentorV4 userId="user123" />
            </div>
          )}
          
          {activeTab === 'health' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
              <HealthTracker userId="user123" />
            </div>
          )}
          
          {activeTab === 'mental' && (
            <div className="h-full rounded-2xl shadow-lg overflow-hidden">
              <MentalHealthMentor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============= SIDEBAR =============
function Sidebar({ activeTab, setActiveTab, globalTime, isGlobalRunning, setIsGlobalRunning, formatTime }) {
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [pauseCount, setPauseCount] = useState(() => {
    const saved = localStorage.getItem('pauseCount');
    return saved ? parseInt(saved) : 0;
  });
  const MAX_PAUSES = 3;

  const handlePauseClick = () => {
    if (isGlobalRunning) {
      if (pauseCount >= MAX_PAUSES) {
        alert(`⚠️ Bạn đã dừng ${MAX_PAUSES} lần rồi! Hãy tập trung học tập nhé.`);
        return;
      }
      setShowPauseModal(true);
    } else {
      setIsGlobalRunning(true);
    }
  };

  const handleConfirmPause = () => {
    if (!pauseReason.trim()) {
      alert('Vui lòng nhập lý do dừng!');
      return;
    }
    
    const newCount = pauseCount + 1;
    setPauseCount(newCount);
    localStorage.setItem('pauseCount', newCount.toString());
    
    // Lưu lý do vào localStorage
    const pauseHistory = JSON.parse(localStorage.getItem('pauseHistory') || '[]');
    pauseHistory.push({
      time: new Date().toISOString(),
      reason: pauseReason,
      duration: globalTime
    });
    localStorage.setItem('pauseHistory', JSON.stringify(pauseHistory));
    
    setIsGlobalRunning(false);
    setShowPauseModal(false);
    setPauseReason('');
  };

  const tabs = [
    { id: 'dashboard', icon: Target, label: 'Tổng quan' },
    { id: 'scheduler', icon: Calendar, label: 'Lịch học' },
    { id: 'dailylog', icon: BookOpen, label: 'Nhật ký' },
    { id: 'pomodoro', icon: Clock, label: 'Pomodoro' },
    { id: 'relax', icon: Coffee, label: 'Thư giãn' },
    { id: 'mentor', icon: BookOpen, label: 'AI Mentor' },
    { id: 'health', icon: Heart, label: 'Sức khỏe' },
    { id: 'mental', icon: Brain, label: 'Tâm lý' }
  ];

  return (
    <>
      <div className="w-64 bg-white/80 backdrop-blur-md shadow-xl h-screen sticky top-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Học Cùng Tôi
          </h1>
          <p className="text-xs text-slate-500 mt-1">Quản lý học tập thông minh</p>
        </div>

        {/* Global Timer */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <div className="text-xs uppercase tracking-wide mb-2">Tổng thời gian</div>
          <div className="text-3xl font-bold font-mono">{formatTime(globalTime)}</div>
          <div className="text-xs mt-1 opacity-80">
            Số lần dừng: {pauseCount}/{MAX_PAUSES}
          </div>
          <button
            onClick={handlePauseClick}
            className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
          >
            {isGlobalRunning ? <Pause className="inline w-4 h-4" /> : <Play className="inline w-4 h-4" />}
            <span className="ml-2">{isGlobalRunning ? 'Tạm dừng' : 'Bắt đầu'}</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">⏸️ Tạm dừng học tập</h3>
              <button 
                onClick={() => setShowPauseModal(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">
                Bạn đã dừng <span className="font-bold text-orange-600">{pauseCount}/{MAX_PAUSES}</span> lần.
              </p>
              {pauseCount >= MAX_PAUSES - 1 && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                  ⚠️ Đây là lần dừng cuối cùng! Hãy tập trung học tập.
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Lý do dừng học: <span className="text-red-500">*</span>
              </label>
              <textarea
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
                rows="3"
                placeholder="VD: Đi vệ sinh, uống nước, nghỉ ngơi..."
                maxLength={100}
              />
              <p className="text-xs text-slate-400 mt-1">{pauseReason.length}/100 ký tự</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmPause}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Xác nhận dừng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============= HEADER =============
function Header() {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-slate-800">Chào buổi sáng! ☀️</h2>
      <p className="text-slate-600 mt-2">
        "Thành công là tổng của những nỗ lực nhỏ lặp đi lặp lại mỗi ngày."
      </p>
    </div>
  );
}

// ============= DASHBOARD VIEW =============
function DashboardView({ dailyLogs, subjectTargets, setSubjectTargets }) {
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Tính tổng thời gian theo môn
  const subjectStats = {};
  dailyLogs.forEach(log => {
    if (!subjectStats[log.subject]) {
      subjectStats[log.subject] = 0;
    }
    subjectStats[log.subject] += log.duration;
  });

  const totalMinutes = dailyLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalActivities = dailyLogs.length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-slate-500 uppercase tracking-wide">Tổng giờ học</div>
          <div className="text-4xl font-bold text-indigo-600 mt-2">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-slate-500 uppercase tracking-wide">Số hoạt động</div>
          <div className="text-4xl font-bold text-purple-600 mt-2">{totalActivities}</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-slate-500 uppercase tracking-wide">Mục tiêu</div>
          <button
            onClick={() => setShowGoalModal(true)}
            className="mt-2 text-pink-600 hover:text-pink-700 font-semibold"
          >
            Cài đặt mục tiêu →
          </button>
        </div>
      </div>

      {/* Progress by Subject */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Tiến độ theo môn</h3>
        <div className="space-y-4">
          {Object.entries(SUBJECTS).map(([key, subject]) => {
            const actual = subjectStats[key] || 0;
            const target = subjectTargets[key] || 0;
            const percentage = target > 0 ? Math.min((actual / target) * 100, 100) : 0;

            return (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{subject.name}</span>
                  <span className="text-sm text-slate-500">
                    {actual}/{target} phút
                  </span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${subject.color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <GoalModal 
          subjectTargets={subjectTargets}
          setSubjectTargets={setSubjectTargets}
          onClose={() => setShowGoalModal(false)}
        />
      )}
    </div>
  );
}

function GoalModal({ subjectTargets, setSubjectTargets, onClose }) {
  const [tempTargets, setTempTargets] = useState(subjectTargets);

  const handleSave = () => {
    setSubjectTargets(tempTargets);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Đặt mục tiêu học tập</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(SUBJECTS).map(([key, subject]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {subject.name} (phút/ngày)
              </label>
              <input
                type="number"
                min="0"
                max="1440"
                step="5"
                value={tempTargets[key] || 0}
                onChange={(e) => setTempTargets({ ...tempTargets, [key]: parseInt(e.target.value) || 0 })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSave();
                  }
                }}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Lưu mục tiêu
          </button>
        </div>
      </div>
    </div>
  );
}

// Component còn lại sẽ được thêm vào phần 2...

export default StudySpace;


// ============= SCHEDULER VIEW =============
function SchedulerView({ schedule, setSchedule }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6:00 - 22:00

  const handleSlotClick = (dayIndex, hour) => {
    setSelectedSlot({ dayIndex, hour });
    setShowModal(true);
  };

  const handleSaveSchedule = (data) => {
    const key = `${selectedSlot.dayIndex}-${selectedSlot.hour}`;
    setSchedule({ ...schedule, [key]: data });
    setShowModal(false);
  };

  const handleDeleteSchedule = () => {
    const key = `${selectedSlot.dayIndex}-${selectedSlot.hour}`;
    const newSchedule = { ...schedule };
    delete newSchedule[key];
    setSchedule(newSchedule);
    setShowModal(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">Lịch học tuần</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-slate-200 p-2 bg-slate-50 w-20">Giờ</th>
              {days.map((day, idx) => (
                <th key={idx} className="border border-slate-200 p-2 bg-slate-50">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => (
              <tr key={hour}>
                <td className="border border-slate-200 p-2 text-center font-medium text-sm">
                  {hour}:00
                </td>
                {days.map((_, dayIndex) => {
                  const key = `${dayIndex}-${hour}`;
                  const slot = schedule[key];
                  
                  return (
                    <td
                      key={dayIndex}
                      onClick={() => handleSlotClick(dayIndex, hour)}
                      className={`border border-slate-200 p-2 cursor-pointer hover:bg-slate-50 transition ${
                        slot ? SUBJECTS[slot.subject]?.lightColor : ''
                      }`}
                    >
                      {slot && (
                        <div className="text-xs">
                          <div className="font-semibold">{SUBJECTS[slot.subject]?.name}</div>
                          <div className="text-slate-600">{ACTIVITIES[slot.type]}</div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ScheduleModal
          slot={selectedSlot}
          existingData={schedule[`${selectedSlot.dayIndex}-${selectedSlot.hour}`]}
          onSave={handleSaveSchedule}
          onDelete={handleDeleteSchedule}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function ScheduleModal({ slot, existingData, onSave, onDelete, onClose }) {
  const [formData, setFormData] = useState(existingData || {
    subject: 'math',
    type: 'new',
    note: ''
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Đặt lịch học</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Môn học</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              {Object.entries(SUBJECTS).map(([key, subject]) => (
                <option key={key} value={key}>{subject.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hoạt động</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              {Object.entries(ACTIVITIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ghi chú</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              rows="3"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(formData)}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Lưu
          </button>
          {existingData && (
            <button
              onClick={onDelete}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============= DAILY LOG VIEW =============
function DailyLogView({ dailyLogs, setDailyLogs }) {
  const [formData, setFormData] = useState({
    subject: 'math',
    activity: 'new',
    duration: 30,
    mood: 3,
    note: '',
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  });

  const handleSubmit = () => {
    const newLog = {
      id: Date.now(),
      ...formData
    };
    setDailyLogs([newLog, ...dailyLogs]);
    
    // Reset form
    setFormData({
      ...formData,
      duration: 30,
      note: '',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const totalToday = dailyLogs.reduce((sum, log) => sum + log.duration, 0);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Form bên trái */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Ghi nhật ký học tập</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Môn học</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(SUBJECTS).map(([key, subject]) => (
                <button
                  key={key}
                  onClick={() => setFormData({ ...formData, subject: key })}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    formData.subject === key
                      ? `${subject.color} text-white`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hoạt động</label>
            <select
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              {Object.entries(ACTIVITIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Thời gian (phút)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cảm xúc</label>
            <div className="flex gap-3">
              {MOODS.map((mood, idx) => (
                <button
                  key={idx}
                  onClick={() => setFormData({ ...formData, mood: idx })}
                  className={`text-4xl transition ${
                    formData.mood === idx ? 'scale-125' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ghi chú</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              rows="3"
              placeholder="Ghi chú về buổi học..."
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            <Plus className="inline w-5 h-5 mr-2" />
            Lưu vào báo cáo
          </button>
        </div>
      </div>

      {/* Danh sách bên phải */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Báo cáo hôm nay</h3>
          <div className="text-right">
            <div className="text-sm text-slate-500">Tổng thời gian</div>
            <div className="text-2xl font-bold text-indigo-600">
              {Math.floor(totalToday / 60)}h {totalToday % 60}m
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {dailyLogs.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              Chưa có hoạt động nào được ghi nhận
            </div>
          ) : (
            dailyLogs.map(log => (
              <div key={log.id} className={`p-4 rounded-lg ${SUBJECTS[log.subject]?.lightColor}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold">{SUBJECTS[log.subject]?.name}</span>
                    <span className="text-sm text-slate-600 ml-2">• {ACTIVITIES[log.activity]}</span>
                  </div>
                  <span className="text-sm text-slate-500">{log.time}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold">{log.duration} phút</span>
                  <span>{MOODS[log.mood]}</span>
                </div>
                {log.note && (
                  <div className="mt-2 text-sm text-slate-600 italic">"{log.note}"</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


// ============= POMODORO VIEW =============
function PomodoroView() {
  const [time, setTime] = useState(25 * 60); // 25 phút
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, short, long

  const modes = {
    focus: { label: 'Tập trung', duration: 25 * 60, color: 'from-red-500 to-orange-500' },
    short: { label: 'Nghỉ ngắn', duration: 5 * 60, color: 'from-green-500 to-teal-500' },
    long: { label: 'Nghỉ dài', duration: 15 * 60, color: 'from-blue-500 to-indigo-500' }
  };

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Có thể thêm âm thanh thông báo ở đây
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTime(modes[newMode].duration);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTime(modes[mode].duration);
    setIsRunning(false);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const progress = ((modes[mode].duration - time) / modes[mode].duration) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-lg text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-8">Pomodoro Timer</h3>

        {/* Mode Selector */}
        <div className="flex gap-3 justify-center mb-8">
          {Object.entries(modes).map(([key, modeData]) => (
            <button
              key={key}
              onClick={() => handleModeChange(key)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                mode === key
                  ? `bg-gradient-to-r ${modeData.color} text-white shadow-lg`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {modeData.label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#e2e8f0"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold font-mono text-slate-800">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 rounded-lg font-semibold text-white shadow-lg transition bg-gradient-to-r ${modes[mode].color}`}
          >
            {isRunning ? (
              <><Pause className="inline w-5 h-5 mr-2" />Tạm dừng</>
            ) : (
              <><Play className="inline w-5 h-5 mr-2" />Bắt đầu</>
            )}
          </button>
          <button
            onClick={handleReset}
            className="px-8 py-4 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
          >
            <RotateCcw className="inline w-5 h-5 mr-2" />
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= RELAX ZONE VIEW =============
function RelaxZoneView() {
  const [activeExercise, setActiveExercise] = useState(null);

  const exercises = [
    {
      id: 'breathing',
      icon: Wind,
      title: 'Hít thở 4-7-8',
      desc: 'Kỹ thuật thở giúp giảm căng thẳng',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'stretch',
      icon: Dumbbell,
      title: 'Vận động nhẹ',
      desc: 'Các bài tập giãn cơ đơn giản',
      color: 'from-orange-500 to-red-500'
    }
  ];

  if (activeExercise === 'breathing') {
    return <BreathingExercise onBack={() => setActiveExercise(null)} />;
  }

  if (activeExercise === 'stretch') {
    return <StretchExercise onBack={() => setActiveExercise(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-800">Góc thư giãn</h3>
        <p className="text-slate-600 mt-2">Nghỉ ngơi để học tập hiệu quả hơn</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {exercises.map(exercise => (
          <button
            key={exercise.id}
            onClick={() => setActiveExercise(exercise.id)}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-left group"
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${exercise.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
              <exercise.icon className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">{exercise.title}</h4>
            <p className="text-slate-600">{exercise.desc}</p>
            <div className="mt-4 text-indigo-600 font-semibold group-hover:translate-x-2 transition inline-block">
              Bắt đầu →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BreathingExercise({ onBack }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [scale, setScale] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [durations, setDurations] = useState(() => {
    const saved = localStorage.getItem('breathingDurations');
    return saved ? JSON.parse(saved) : { inhale: 4, hold: 7, exhale: 8 };
  });

  // Save breathing durations to localStorage
  useEffect(() => {
    localStorage.setItem('breathingDurations', JSON.stringify(durations));
  }, [durations]);

  useEffect(() => {
    if (!isActive) return;

    const phases = [
      { name: 'inhale', duration: durations.inhale * 1000, scale: 1.5, color: 'teal' },
      { name: 'hold', duration: durations.hold * 1000, scale: 1.5, color: 'indigo' },
      { name: 'exhale', duration: durations.exhale * 1000, scale: 1, color: 'slate' }
    ];

    let currentPhaseIndex = 0;

    const runPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setPhase(currentPhase.name);
      setScale(currentPhase.scale);

      setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        runPhase();
      }, currentPhase.duration);
    };

    runPhase();
  }, [isActive, durations]);

  const phaseLabels = {
    inhale: 'Hít vào',
    hold: 'Giữ hơi',
    exhale: 'Thở ra'
  };

  const phaseColors = {
    inhale: 'bg-teal-500',
    hold: 'bg-indigo-500',
    exhale: 'bg-slate-400'
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-slate-600 hover:text-slate-800 font-medium"
      >
        ← Quay lại
      </button>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-lg text-center">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-3xl font-bold text-slate-800">Hít thở {durations.inhale}-{durations.hold}-{durations.exhale}</h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            title="Cài đặt"
          >
            ⚙️
          </button>
        </div>
        <p className="text-slate-600 mb-8">Hít vào {durations.inhale} giây, giữ {durations.hold} giây, thở ra {durations.exhale} giây</p>

        {showSettings && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold mb-3">Tùy chỉnh thời gian</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Hít vào (giây)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={durations.inhale}
                  onChange={(e) => setDurations({...durations, inhale: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Giữ hơi (giây)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={durations.hold}
                  onChange={(e) => setDurations({...durations, hold: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Thở ra (giây)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={durations.exhale}
                  onChange={(e) => setDurations({...durations, exhale: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        <div className="relative w-64 h-64 mx-auto mb-8">
          <div
            className={`absolute inset-0 rounded-full ${phaseColors[phase]} transition-all duration-1000 ease-in-out`}
            style={{
              transform: `scale(${scale})`,
              opacity: 0.3
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold text-slate-800">
              {phaseLabels[phase]}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-8 py-4 rounded-lg font-semibold text-white shadow-lg transition ${
            isActive
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gradient-to-r from-teal-500 to-cyan-500'
          }`}
        >
          {isActive ? 'Dừng lại' : 'Bắt đầu ngay'}
        </button>
      </div>
    </div>
  );
}

// Move exercises array outside component to avoid re-creation
const STRETCH_EXERCISES = [
  { name: 'Xoay cổ', duration: 30, desc: 'Xoay cổ nhẹ nhàng theo chiều kim đồng hồ' },
  { name: 'Giãn vai', duration: 30, desc: 'Nâng vai lên rồi thả xuống' },
  { name: 'Vặn người', duration: 30, desc: 'Ngồi thẳng, vặn người sang hai bên' },
  { name: 'Duỗi tay', duration: 30, desc: 'Duỗi thẳng tay ra trước, kéo về phía ngực' }
];

function StretchExercise({ onBack }) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem('stretchExercises');
    return saved ? JSON.parse(saved) : [
      { name: 'Xoay cổ', duration: 30, desc: 'Xoay cổ nhẹ nhàng theo chiều kim đồng hồ' },
      { name: 'Giãn vai', duration: 30, desc: 'Nâng vai lên rồi thả xuống' },
      { name: 'Vặn người', duration: 30, desc: 'Ngồi thẳng, vặn người sang hai bên' },
      { name: 'Duỗi tay', duration: 30, desc: 'Duỗi thẳng tay ra trước, kéo về phía ngực' }
    ];
  });

  // Save stretch exercises to localStorage
  useEffect(() => {
    localStorage.setItem('stretchExercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    if (!isActive || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentExercise < exercises.length - 1) {
            setCurrentExercise(prev => prev + 1);
            return exercises[currentExercise + 1].duration;
          } else {
            setIsActive(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, currentExercise, exercises]);

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(exercises[currentExercise].duration);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentExercise(0);
    setTimeLeft(exercises[0].duration);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-slate-600 hover:text-slate-800 font-medium"
      >
        ← Quay lại
      </button>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-lg text-center">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-slate-800">Vận động nhẹ</h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            title="Cài đặt"
          >
            ⚙️
          </button>
        </div>

        {showSettings && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg text-left">
            <h4 className="font-semibold mb-3">Tùy chỉnh động tác</h4>
            <div className="space-y-3">
              {exercises.map((ex, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={ex.name}
                    onChange={(e) => {
                      const newEx = [...exercises];
                      newEx[idx].name = e.target.value;
                      setExercises(newEx);
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="Tên động tác"
                  />
                  <input
                    type="number"
                    min="10"
                    max="120"
                    value={ex.duration}
                    onChange={(e) => {
                      const newEx = [...exercises];
                      newEx[idx].duration = parseInt(e.target.value) || 10;
                      setExercises(newEx);
                    }}
                    className="w-20 px-3 py-2 border rounded-lg"
                    placeholder="Giây"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="text-6xl font-bold text-orange-600 mb-4">{timeLeft}s</div>
          <div className="text-2xl font-bold text-slate-800 mb-2">
            {exercises[currentExercise].name}
          </div>
          <div className="text-slate-600">
            {exercises[currentExercise].desc}
          </div>
        </div>

        <div className="flex gap-2 justify-center mb-8">
          {exercises.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentExercise(idx);
                setTimeLeft(exercises[idx].duration);
                setIsActive(false);
              }}
              className={`h-2 w-12 rounded-full transition cursor-pointer hover:opacity-80 ${
                idx === currentExercise ? 'bg-orange-500' : 'bg-slate-200'
              }`}
              title={`Động tác ${idx + 1}: ${exercises[idx].name}`}
            />
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={isActive ? () => setIsActive(false) : handleStart}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
          >
            {isActive ? 'Tạm dừng' : 'Bắt đầu'}
          </button>
          <button
            onClick={() => {
              if (currentExercise < exercises.length - 1) {
                setCurrentExercise(currentExercise + 1);
                setTimeLeft(exercises[currentExercise + 1].duration);
                setIsActive(false);
              }
            }}
            disabled={currentExercise >= exercises.length - 1}
            className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiếp theo →
          </button>
          <button
            onClick={handleReset}
            className="px-8 py-4 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
          >
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
}
