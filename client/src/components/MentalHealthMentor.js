import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Send, Smile, Frown, ListChecks, 
  RefreshCw, Sparkles, Loader2,
  User, History, MessageSquare, Trash2,
  TrendingUp, Menu, X, GraduationCap,
  Quote, CheckCircle2, Clock, Target, Shield,
  Lock, Unlock, AlertCircle, Book, Calendar,
  Home
} from 'lucide-react';
import './MentalHealthMentor.css';

// --- CONFIGURATION ---
// Sử dụng backend proxy thay vì gọi trực tiếp API
const GEMINI_PROXY_URL = '/api/gemini/generate';

// --- PROMPT KỸ THUẬT ---
const getSystemPrompt = (userName, mentorType, currentRoadmapJSON) => `
Bạn là: ${mentorType === 'male' ? 'Thầy giáo (Thầy - em)' : 'Cô giáo (Cô - em)'} tâm lý & học tập.
Học sinh: "${userName}".

DỮ LIỆU HIỆN TẠI (ROADMAP):
${currentRoadmapJSON}

NHIỆM VỤ:
1. Tư vấn ngắn gọn, cảm xúc.
2. TẠO HOẶC CẬP NHẬT LỘ TRÌNH (ROADMAP).

QUY TẮC ROADMAP (BẮT BUỘC):
- Nếu Roadmap rỗng [] VÀ học sinh chia sẻ vấn đề -> **TẠO ROADMAP (5-7 bước, 3 pha).**
- Nếu Roadmap đã có: Giữ nguyên (trả về []) trừ khi học sinh yêu cầu sửa.

CẤU TRÚC 3 PHA:
- Pha 1: Ổn định (Shield).
- Pha 2: Hành động (Target).
- Pha 3: Duy trì (TrendingUp).

ĐỊNH DẠNG JSON:
{
  "message": "Nội dung chat...",
  "topic_title": "Tên chủ đề (ngắn gọn)...",
  "stats": { "positivity": 50, "negativity": 20, "stability": 50 },
  "roadmap": [
    { "phase": "Pha 1: Ổn định", "title": "Tên bước", "desc": "Mô tả...", "time": "Thời gian" }
  ] 
}
`;

// --- UTILS ---
const generateId = () => Math.random().toString(36).substr(2, 9);

const FormattedText = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span className="text-gray-800">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-bold text-indigo-900">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

const cleanJSON = (text) => {
  if (!text) return null;
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```/, '').replace(/```$/, '');
  }
  return cleanText.trim();
};

function MentalHealthMentor() {
  // --- STATE ---
  const [userData, setUserData] = useState({ name: '', mentor: 'female', setupDone: false });
  const [sessions, setSessions] = useState([]); 
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);
  const [isRoadmapLocked, setIsRoadmapLocked] = useState(false);
  const [showJournal, setShowJournal] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // --- EFFECT ---
  useEffect(() => {
    const savedSessions = localStorage.getItem('mindful_sessions_v9');
    const savedUser = localStorage.getItem('mindful_user_v9');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedUser) setUserData(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('mindful_sessions_v9', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('mindful_user_v9', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    if (!showJournal) scrollToBottom();
  }, [currentSessionId, sessions, isLoading, showJournal]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  const getCurrentSession = () => sessions.find(s => s.id === currentSessionId);

  const createNewSession = (initialMood) => {
    const newId = generateId();
    const welcomeMsg = initialMood === 'negative'
      ? `Chào ${userData.name}. ${userData.mentor === 'male' ? 'Thầy' : 'Cô'} đây. Có chuyện gì khiến em phiền lòng sao? Hãy kể cho ${userData.mentor === 'male' ? 'Thầy' : 'Cô'} nghe nhé.`
      : `Chào ${userData.name}! Thật tuyệt khi thấy em vui vẻ. Điều gì đã mang lại năng lượng tích cực này thế? Chia sẻ với ${userData.mentor === 'male' ? 'Thầy' : 'Cô'} nào!`;

    const newSession = {
      id: newId,
      title: 'Tư vấn mới',
      createdAt: new Date().toISOString(),
      messages: [{ role: 'ai', text: welcomeMsg }],
      roadmap: [],
      stats: { positivity: 50, negativity: 10, stability: 50 }
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setShowHistoryMobile(false);
    setShowJournal(false);
    setIsRoadmapLocked(false);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn cuộc trò chuyện và lộ trình này không?")) {
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) {
        setCurrentSessionId(null);
        setShowJournal(false);
      }
    }
  };

  // --- API CALL ---
  const callGemini = async (userText) => {
    const currentSess = getCurrentSession();
    if (!currentSess) return;

    setIsLoading(true);
    try {
      const historyText = currentSess.messages.map(m => 
        `${m.role === 'user' ? 'Học sinh' : 'Gia sư'}: ${m.text}`
      ).join('\n');

      const currentRoadmapJSON = JSON.stringify(currentSess.roadmap);
      const fullPrompt = `${getSystemPrompt(userData.name, userData.mentor, currentRoadmapJSON)}\n\nLỊCH SỬ CHAT:\n${historyText}\n\nHọc sinh: "${userText}"`;

      // Sử dụng backend proxy
      const response = await fetch(GEMINI_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullPrompt,
          responseFormat: "json"
        }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "API Error");
      
      const cleanedJson = cleanJSON(data.text);
      const parsed = JSON.parse(cleanedJson);

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          let newRoadmap = s.roadmap;
          if (!isRoadmapLocked && parsed.roadmap && Array.isArray(parsed.roadmap) && parsed.roadmap.length > 0) {
              newRoadmap = parsed.roadmap;
          }
          return {
            ...s,
            title: (s.messages.length <= 2 && parsed.topic_title) ? parsed.topic_title : s.title,
            messages: [...s.messages, { role: 'ai', text: parsed.message }],
            roadmap: newRoadmap,
            stats: parsed.stats || s.stats
          };
        }
        return s;
      }));

    } catch (error) {
      console.error("Lỗi xử lý:", error);
      setSessions(prev => prev.map(s => {
        if(s.id === currentSessionId) {
             return { ...s, messages: [...s.messages, { role: 'ai', text: "Hmm, kết nối hơi chập chờn. Em nói lại được không?" }] }
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    const text = inputRef.current?.value;
    if (!text || !text.trim()) return;

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: [...s.messages, { role: 'user', text: text }] };
      }
      return s;
    }));

    if (inputRef.current) inputRef.current.value = '';
    callGemini(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPhaseIcon = (phaseName) => {
    if (phaseName.includes('1') || phaseName.includes('Ổn định')) return <Shield className="w-4 h-4 text-blue-500" />;
    if (phaseName.includes('2') || phaseName.includes('Hành động')) return <Target className="w-4 h-4 text-red-500" />;
    return <TrendingUp className="w-4 h-4 text-green-500" />;
  };

  // --- COMPONENT: JOURNAL VIEW ---
  const JournalView = () => {
    const roadmapSessions = sessions.filter(s => s.roadmap && s.roadmap.length > 0);

    return (
      <div className="flex-1 bg-slate-50 overflow-y-auto p-4 md:p-8 animate-in fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Book className="w-8 h-8 text-indigo-600" />
                Sổ tay Lộ trình
              </h2>
              <p className="text-gray-500 mt-1">Tổng hợp tất cả kế hoạch hành động của bạn.</p>
            </div>
            <button onClick={() => setShowJournal(false)} className="p-2 bg-white rounded-lg border hover:bg-gray-50 text-gray-600"><X className="w-6 h-6" /></button>
          </div>
          {roadmapSessions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><ListChecks className="w-10 h-10 text-gray-300" /></div>
              <p className="text-gray-500">Chưa có lộ trình nào được lưu.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {roadmapSessions.map(session => (
                <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-indigo-900">{session.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><Calendar className="w-3 h-3" />{new Date(session.createdAt).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div className="flex items-center gap-2 self-start md:self-auto">
                        <button onClick={() => { setCurrentSessionId(session.id); setShowJournal(false); setShowHistoryMobile(false); }} className="px-4 py-2 bg-white border text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors">Mở lại</button>
                        <button onClick={(e) => deleteSession(e, session.id)} className="p-2 bg-white border border-rose-100 text-rose-500 rounded-lg hover:bg-rose-50 transition-colors" title="Xóa lộ trình này"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {session.roadmap.map((step, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">{getPhaseIcon(step.phase || '')}<span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">{step.phase}</span></div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2" title={step.desc}>{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!userData.setupDone) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4 font-sans text-gray-900 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-md w-full my-auto border border-gray-100">
           <div className="text-center mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-200">
              <User className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
            <p className="text-gray-500 mt-1 text-sm">Giúp AI hiểu em hơn</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên của em</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none transition-all" 
                placeholder="Nhập tên..." 
                value={userData.name} 
                onChange={e => setUserData({...userData, name: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Người đồng hành</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setUserData({...userData, mentor: 'male'})} 
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${userData.mentor === 'male' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                >
                  <GraduationCap className="w-7 h-7" />
                  <span className="font-semibold text-sm">Thầy Giáo</span>
                </button>
                <button 
                  onClick={() => setUserData({...userData, mentor: 'female'})} 
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${userData.mentor === 'female' ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-md' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                >
                  <Sparkles className="w-7 h-7" />
                  <span className="font-semibold text-sm">Cô Giáo</span>
                </button>
              </div>
            </div>
            <button 
              disabled={!userData.name.trim()} 
              onClick={() => setUserData({...userData, setupDone: true})} 
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl mt-2"
            >
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSession = getCurrentSession();

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-indigo-50 overflow-hidden font-sans text-gray-900">
      {/* LEFT SIDEBAR */}
      <div className={`fixed md:relative inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${showHistoryMobile ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col shadow-xl md:shadow-none`}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
            <h2 className="font-bold flex gap-2 text-indigo-900"><History className="text-indigo-600 w-5 h-5"/> Lịch sử</h2>
            <button onClick={() => setShowHistoryMobile(false)} className="md:hidden hover:bg-gray-100 rounded-lg p-1 transition"><X className="w-5 h-5 text-gray-400"/></button>
        </div>
        
        <div className="p-3 space-y-2">
            <button onClick={() => { setCurrentSessionId(null); setShowHistoryMobile(false); setShowJournal(false); }} className="w-full flex gap-2 justify-center p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all">
                <RefreshCw className="w-4 h-4"/> Phiên mới
            </button>
            <button onClick={() => { setShowJournal(true); setShowHistoryMobile(false); }} className={`w-full flex gap-2 justify-center p-3 rounded-xl font-semibold border transition-all ${showJournal ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'}`}>
                <Book className="w-4 h-4"/> Sổ tay
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {sessions.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2"/>
                <p className="text-xs text-gray-400">Chưa có phiên nào</p>
              </div>
            ) : (
              sessions.map(sess => (
                <div key={sess.id} onClick={() => { setCurrentSessionId(sess.id); setShowHistoryMobile(false); setShowJournal(false); }} className={`flex justify-between p-3 rounded-lg cursor-pointer group transition-all ${currentSessionId === sess.id && !showJournal ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-900 font-medium shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}>
                    <div className="flex gap-2.5 overflow-hidden items-center">
                        <MessageSquare className="w-4 h-4 flex-shrink-0"/>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm">{sess.title}</p>
                            {sess.roadmap && sess.roadmap.length > 0 && <span className="text-[10px] text-green-600 flex items-center gap-1 mt-0.5"><CheckCircle2 size={10}/> Lộ trình</span>}
                        </div>
                    </div>
                    <button onClick={(e) => deleteSession(e, sess.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              ))
            )}
        </div>
        <div className="p-3 border-t bg-gradient-to-r from-gray-50 to-indigo-50 flex gap-2.5 items-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">{userData.name.charAt(0).toUpperCase()}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-bold text-gray-800 truncate">{userData.name}</p><button onClick={() => setUserData({...userData, setupDone: false})} className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline">Đổi thông tin</button></div>
        </div>
      </div>

      {/* MAIN AREA */}
      {showJournal ? (
        <JournalView />
      ) : (
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-slate-50 to-white relative">
          <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 h-14 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2">
                  <button onClick={() => setShowHistoryMobile(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"><Menu className="w-5 h-5 text-gray-500"/></button>
                  <button onClick={() => setCurrentSessionId(null)} className="p-2 hover:bg-indigo-50 rounded-lg text-gray-600 transition" title="Trang chủ">
                     <Home className="w-5 h-5 text-indigo-600" />
                  </button>
                  {currentSession && <h2 className="font-bold flex gap-2 text-sm md:text-base items-center text-gray-800">{userData.mentor === 'male' ? <GraduationCap className="text-indigo-600 w-5 h-5"/> : <Sparkles className="text-rose-500 w-5 h-5"/>} {userData.mentor === 'male' ? 'Thầy giáo' : 'Cô giáo'}</h2>}
              </div>
              {currentSession && (
                  <div className="flex gap-1.5 flex-col items-end">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Trạng thái</span>
                      <div className="flex gap-1.5">
                          <div title="Tích cực" className={`h-2 w-2 rounded-full transition-all ${currentSession.stats.positivity > 50 ? 'bg-green-500 shadow-sm shadow-green-300' : 'bg-gray-200'}`}></div>
                          <div title="Ổn định" className={`h-2 w-2 rounded-full transition-all ${currentSession.stats.stability > 50 ? 'bg-blue-500 shadow-sm shadow-blue-300' : 'bg-gray-200'}`}></div>
                          <div title="Căng thẳng" className={`h-2 w-2 rounded-full transition-all ${currentSession.stats.negativity > 30 ? 'bg-red-400 shadow-sm shadow-red-300' : 'bg-gray-200'}`}></div>
                      </div>
                  </div>
              )}
          </header>

          {!currentSession ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center mb-6 animate-pulse"><Brain className="w-10 h-10 text-white"/></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Xin chào, {userData.name}!</h2>
                  <p className="text-gray-500 mb-8 text-sm md:text-base">Hôm nay bạn cảm thấy thế nào?</p>
                  <div className="flex gap-3 w-full max-w-md flex-col sm:flex-row">
                      <button onClick={() => createNewSession('negative')} className="flex-1 flex justify-center items-center gap-2 px-5 py-3.5 bg-white border-2 border-rose-200 text-rose-600 rounded-xl shadow-md hover:border-rose-300 hover:shadow-lg hover:scale-105 font-semibold transition-all"><Frown className="w-5 h-5"/> Cần hỗ trợ</button>
                      <button onClick={() => createNewSession('positive')} className="flex-1 flex justify-center items-center gap-2 px-5 py-3.5 bg-white border-2 border-teal-200 text-teal-600 rounded-xl shadow-md hover:border-teal-300 hover:shadow-lg hover:scale-105 font-semibold transition-all"><Smile className="w-5 h-5"/> Chia sẻ vui</button>
                  </div>
              </div>
          ) : (
              <>
                  <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 scroll-smooth">
                      {currentSession.messages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                              <div className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm text-sm md:text-base leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-md' : 'bg-white border border-gray-100 rounded-bl-md text-gray-800'}`}>
                                  {msg.role === 'ai' && <div className="absolute -left-9 top-0 hidden md:flex w-7 h-7 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 items-center justify-center shadow-sm">{userData.mentor === 'male' ? <GraduationCap size={14} className="text-indigo-600"/> : <Sparkles size={14} className="text-rose-600"/>}</div>}
                                  {msg.role === 'user' ? msg.text : <FormattedText text={msg.text} />}
                              </div>
                          </div>
                      ))}
                      {isLoading && <div className="flex pl-10"><div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 flex gap-2.5 items-center shadow-sm"><Loader2 className="animate-spin text-indigo-500 w-4 h-4"/><span className="text-gray-400 text-sm">Đang suy nghĩ...</span></div></div>}
                      <div ref={messagesEndRef} />
                  </div>
                  <div className="p-3 bg-white border-t border-gray-200 shadow-lg">
                      <div className="max-w-4xl mx-auto flex gap-2 relative">
                          <input ref={inputRef} onKeyDown={handleKeyDown} type="text" placeholder="Nhập tin nhắn..." className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all border border-gray-200" autoFocus />
                          <button onClick={handleSend} disabled={isLoading} className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"><Send className="w-5 h-5"/></button>
                      </div>
                  </div>
              </>
          )}
        </div>
      )}

      {/* RIGHT SIDEBAR - ROADMAP */}
      {currentSession && !showJournal && (
        <div className="hidden lg:flex w-80 xl:w-96 bg-white border-l border-gray-200 flex-col transition-all shadow-xl">
            <div className="p-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border-b border-gray-200 flex justify-between items-center">
                <div><h3 className="font-bold text-indigo-900 flex gap-2 text-base"><ListChecks className="text-indigo-600 w-5 h-5"/> Lộ trình</h3><p className="text-[10px] text-gray-500 mt-0.5">{isRoadmapLocked ? '🔒 Đã khóa' : '🔓 Tự động'}</p></div>
                <button onClick={() => setIsRoadmapLocked(!isRoadmapLocked)} className={`p-2 rounded-lg transition-all ${isRoadmapLocked ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`} title={isRoadmapLocked ? 'Mở khóa' : 'Khóa lộ trình'}>{isRoadmapLocked ? <Lock size={16}/> : <Unlock size={16}/>}</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentSession.roadmap.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 px-4">
                        <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"><Quote className="text-gray-300 w-7 h-7"/></div>
                        <p className="text-xs text-gray-400 leading-relaxed">Chia sẻ vấn đề để {userData.mentor === 'male' ? 'Thầy' : 'Cô'} lập kế hoạch nhé.</p>
                    </div>
                ) : (
                    currentSession.roadmap.map((step, idx) => (
                        <div key={idx} className="relative pl-7 animate-in fade-in slide-in-from-right-4" style={{animationDelay: `${idx * 80}ms`}}>
                            <div className="absolute left-[13px] top-7 bottom-[-16px] w-0.5 bg-gradient-to-b from-gray-200 to-transparent last:bottom-auto"></div>
                            <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center z-10">{getPhaseIcon(step.phase || '')}</div>
                            <div className="bg-white rounded-lg border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md overflow-hidden group transition-all">
                                <div className="bg-gradient-to-r from-gray-50 to-white px-3 py-2 border-b border-gray-100 flex justify-between items-center"><span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{step.phase}</span>{step.time && <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full flex gap-1 items-center font-medium"><Clock size={9}/> {step.time}</span>}</div>
                                <div className="p-3"><h4 className="font-bold text-gray-800 text-sm mb-1.5 group-hover:text-indigo-700 transition">{step.title}</h4><p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p></div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-3 bg-gradient-to-r from-gray-50 to-indigo-50 border-t border-gray-200"><div className="flex gap-2 items-center p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm"><CheckCircle2 className="text-indigo-500 w-6 h-6 flex-shrink-0"/><div className="text-[10px] text-gray-500 leading-snug">Hoàn thành từng bước nhỏ để thấy sự thay đổi lớn.</div></div></div>
        </div>
      )}
    </div>
  );
}

export default MentalHealthMentor;
