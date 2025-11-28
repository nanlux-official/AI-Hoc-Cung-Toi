// Danh sách các trường đại học phổ biến tại Việt Nam
export const UNIVERSITIES = [
  {
    id: 'dhqg-hcm',
    name: 'ĐH Quốc gia TP.HCM',
    shortName: 'ĐHQG HCM',
    logo: '🎓',
    color: 'from-blue-600 to-blue-800',
    examDate: '2025-06-28' // Kỳ thi THPT Quốc gia
  },
  {
    id: 'dhqg-hn',
    name: 'ĐH Quốc gia Hà Nội',
    shortName: 'ĐHQG HN',
    logo: '🎓',
    color: 'from-red-600 to-red-800',
    examDate: '2025-06-28'
  },
  {
    id: 'bk-hcm',
    name: 'ĐH Bách Khoa TP.HCM',
    shortName: 'ĐHBK HCM',
    logo: '⚙️',
    color: 'from-indigo-600 to-indigo-800',
    examDate: '2025-06-28'
  },
  {
    id: 'bk-hn',
    name: 'ĐH Bách Khoa Hà Nội',
    shortName: 'ĐHBK HN',
    logo: '⚙️',
    color: 'from-purple-600 to-purple-800',
    examDate: '2025-06-28'
  },
  {
    id: 'khtn-hcm',
    name: 'ĐH Khoa học Tự nhiên TP.HCM',
    shortName: 'ĐHKHTN HCM',
    logo: '🔬',
    color: 'from-green-600 to-green-800',
    examDate: '2025-06-28'
  },
  {
    id: 'khtn-hn',
    name: 'ĐH Khoa học Tự nhiên Hà Nội',
    shortName: 'ĐHKHTN HN',
    logo: '🔬',
    color: 'from-teal-600 to-teal-800',
    examDate: '2025-06-28'
  },
  {
    id: 'khxh-nv-hcm',
    name: 'ĐH Khoa học Xã hội & Nhân văn TP.HCM',
    shortName: 'ĐHKHXH&NV HCM',
    logo: '📚',
    color: 'from-orange-600 to-orange-800',
    examDate: '2025-06-28'
  },
  {
    id: 'y-duoc-hcm',
    name: 'ĐH Y Dược TP.HCM',
    shortName: 'ĐH Y Dược HCM',
    logo: '⚕️',
    color: 'from-cyan-600 to-cyan-800',
    examDate: '2025-06-28'
  },
  {
    id: 'y-hn',
    name: 'ĐH Y Hà Nội',
    shortName: 'ĐH Y HN',
    logo: '⚕️',
    color: 'from-pink-600 to-pink-800',
    examDate: '2025-06-28'
  },
  {
    id: 'kinh-te-hcm',
    name: 'ĐH Kinh tế TP.HCM',
    shortName: 'ĐH Kinh tế HCM',
    logo: '💼',
    color: 'from-yellow-600 to-yellow-800',
    examDate: '2025-06-28'
  },
  {
    id: 'ngoai-thuong',
    name: 'ĐH Ngoại thương',
    shortName: 'ĐH Ngoại thương',
    logo: '🌐',
    color: 'from-blue-500 to-blue-700',
    examDate: '2025-06-28'
  },
  {
    id: 'su-pham-hn',
    name: 'ĐH Sư phạm Hà Nội',
    shortName: 'ĐHSP HN',
    logo: '👨‍🏫',
    color: 'from-rose-600 to-rose-800',
    examDate: '2025-06-28'
  },
  {
    id: 'su-pham-hcm',
    name: 'ĐH Sư phạm TP.HCM',
    shortName: 'ĐHSP HCM',
    logo: '👩‍🏫',
    color: 'from-violet-600 to-violet-800',
    examDate: '2025-06-28'
  },
  {
    id: 'luat-hcm',
    name: 'ĐH Luật TP.HCM',
    shortName: 'ĐH Luật HCM',
    logo: '⚖️',
    color: 'from-slate-600 to-slate-800',
    examDate: '2025-06-28'
  },
  {
    id: 'ton-duc-thang',
    name: 'ĐH Tôn Đức Thắng',
    shortName: 'ĐHTĐT',
    logo: '🏛️',
    color: 'from-emerald-600 to-emerald-800',
    examDate: '2025-06-28'
  },
  {
    id: 'custom',
    name: 'Trường khác',
    shortName: 'Tùy chỉnh',
    logo: '🎯',
    color: 'from-gray-600 to-gray-800',
    examDate: '2025-06-28'
  }
];

export const getUniversityById = (id) => {
  return UNIVERSITIES.find(uni => uni.id === id) || UNIVERSITIES[0];
};
