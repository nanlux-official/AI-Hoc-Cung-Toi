// Utility functions for localStorage management

export const clearAllData = () => {
  const keys = [
    'studyLogs',
    'studySchedule',
    'subjectTargets',
    'globalTime',
    'breathingDurations',
    'stretchExercises'
  ];
  
  keys.forEach(key => localStorage.removeItem(key));
  
  // Clear health tracker data (pattern: healthTracker_*)
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('healthTracker_')) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('✅ Đã xóa toàn bộ dữ liệu!');
};

export const exportData = () => {
  const data = {
    studyLogs: localStorage.getItem('studyLogs'),
    studySchedule: localStorage.getItem('studySchedule'),
    subjectTargets: localStorage.getItem('subjectTargets'),
    globalTime: localStorage.getItem('globalTime'),
    breathingDurations: localStorage.getItem('breathingDurations'),
    stretchExercises: localStorage.getItem('stretchExercises'),
    exportDate: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    
    Object.keys(data).forEach(key => {
      if (key !== 'exportDate' && data[key]) {
        localStorage.setItem(key, data[key]);
      }
    });
    
    console.log('✅ Đã import dữ liệu thành công!');
    return true;
  } catch (error) {
    console.error('❌ Lỗi import dữ liệu:', error);
    return false;
  }
};

export const getStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024).toFixed(2) + ' KB';
};
