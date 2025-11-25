// Dữ liệu 10 tỉnh thành, huyện, trường học
export const provinces = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Quảng Ngãi',
  'Nghệ An',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Bình Dương'
];

export const districts = {
  'Quảng Ngãi': [
    'Thành phố Quảng Ngãi',
    'Bình Sơn',
    'Tư Nghĩa',
    'Sơn Tịnh',
    'Trà Bồng',
    'Sơn Hà',
    'Sơn Tây',
    'Minh Long',
    'Nghĩa Hành',
    'Mộ Đức',
    'Đức Phổ',
    'Ba Tơ',
    'Lý Sơn'
  ],
  'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy', 'Thanh Xuân'],
  'Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 10', 'Tân Bình', 'Bình Thạnh'],
  'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu'],
  'Hải Phòng': ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An'],
  'Cần Thơ': ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt'],
  'Nghệ An': ['Thành phố Vinh', 'Cửa Lò', 'Diễn Châu', 'Đô Lương', 'Yên Thành'],
  'Thanh Hóa': ['Thành phố Thanh Hóa', 'Sầm Sơn', 'Bỉm Sơn', 'Nghi Sơn'],
  'Thừa Thiên Huế': ['Thành phố Huế', 'Hương Thủy', 'Hương Trà', 'Phú Vang'],
  'Bình Dương': ['Thủ Dầu Một', 'Dĩ An', 'Thuận An', 'Bến Cát', 'Tân Uyên']
};

export const schools = {
  // Quảng Ngãi
  'Thành phố Quảng Ngãi': [
    'THPT Chuyên Lê Khiết',
    'THPT Trần Phú',
    'THPT Phạm Văn Đồng',
    'THPT Nguyễn Trãi'
  ],
  'Sơn Tịnh': [
    'THPT Ba Gia',
    'THPT Sơn Tịnh',
    'THPT Tịnh Ấn Đông'
  ],
  'Bình Sơn': ['THPT Bình Sơn', 'THPT Bình Châu'],
  'Tư Nghĩa': ['THPT Tư Nghĩa', 'THPT Nghĩa Phương'],
  'Trà Bồng': ['THPT Trà Bồng'],
  'Sơn Hà': ['THPT Sơn Hà'],
  'Sơn Tây': ['THPT Sơn Tây'],
  'Minh Long': ['THPT Minh Long'],
  'Nghĩa Hành': ['THPT Nghĩa Hành'],
  'Mộ Đức': ['THPT Mộ Đức'],
  'Đức Phổ': ['THPT Đức Phổ'],
  'Ba Tơ': ['THPT Ba Tơ'],
  'Lý Sơn': ['THPT Lý Sơn'],
  
  // Hà Nội
  'Ba Đình': ['THPT Chu Văn An', 'THPT Nguyễn Bỉnh Khiêm'],
  'Hoàn Kiếm': ['THPT Lương Thế Vinh'],
  'Đống Đa': ['THPT Nguyễn Huệ', 'THPT Việt Đức'],
  'Hai Bà Trưng': ['THPT Trần Phú'],
  'Cầu Giấy': ['THPT Cầu Giấy', 'THPT Nguyễn Chí Thanh'],
  'Thanh Xuân': ['THPT Thanh Xuân'],
  
  // Hồ Chí Minh
  'Quận 1': ['THPT Lê Quý Đôn', 'THPT Nguyễn Thượng Hiền'],
  'Quận 3': ['THPT Gia Định', 'THPT Nguyễn Thị Minh Khai'],
  'Quận 5': ['THPT Nguyễn Trãi'],
  'Quận 10': ['THPT Trần Đại Nghĩa'],
  'Tân Bình': ['THPT Tân Bình'],
  'Bình Thạnh': ['THPT Bình Thạnh'],
  
  // Các tỉnh khác (mẫu)
  'Hải Châu': ['THPT Phan Châu Trinh', 'THPT Hoàng Hoa Thám'],
  'Thanh Khê': ['THPT Thanh Khê'],
  'Hồng Bàng': ['THPT Trần Phú'],
  'Ninh Kiều': ['THPT Chuyên Lý Tự Trọng'],
  'Thành phố Vinh': ['THPT Chuyên Phan Bội Châu'],
  'Thành phố Thanh Hóa': ['THPT Lam Sơn'],
  'Thành phố Huế': ['THPT Quốc Học Huế'],
  'Thủ Dầu Một': ['THPT Bình Dương']
};

export const subjects = [
  'Toán',
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Văn học',
  'Tiếng Anh',
  'Lịch sử',
  'Địa lý',
  'Công nghệ',
  'Tin học',
  'Giáo dục công dân'
];

export const grades = ['6', '7', '8', '9', '10', '11', '12'];

export const bookSets = [
  'Kết nối tri thức',
  'Chân trời sáng tạo',
  'Cánh diều'
];

// Dữ liệu giáo viên mẫu theo môn
export const teachersBySubject = {
  'Toán': [
    { name: 'Nguyễn Văn A', gender: 'Nam' },
    { name: 'Trần Thị B', gender: 'Nữ' },
    { name: 'Lê Văn C', gender: 'Nam' }
  ],
  'Vật lý': [
    { name: 'Phạm Văn D', gender: 'Nam' },
    { name: 'Hoàng Thị E', gender: 'Nữ' }
  ],
  'Hóa học': [
    { name: 'Đỗ Văn F', gender: 'Nam' },
    { name: 'Vũ Thị G', gender: 'Nữ' }
  ],
  'Sinh học': [
    { name: 'Bùi Thị H', gender: 'Nữ' },
    { name: 'Đinh Văn I', gender: 'Nam' }
  ],
  'Văn học': [
    { name: 'Mai Thị K', gender: 'Nữ' },
    { name: 'Trương Văn L', gender: 'Nam' }
  ],
  'Tiếng Anh': [
    { name: 'Ngô Thị M', gender: 'Nữ' },
    { name: 'Phan Văn N', gender: 'Nam' }
  ],
  'Lịch sử': [
    { name: 'Lý Văn O', gender: 'Nam' }
  ],
  'Địa lý': [
    { name: 'Võ Thị P', gender: 'Nữ' }
  ],
  'Công nghệ': [
    { name: 'Đặng Văn Q', gender: 'Nam' }
  ],
  'Tin học': [
    { name: 'Dương Văn R', gender: 'Nam' }
  ],
  'Giáo dục công dân': [
    { name: 'Hồ Thị S', gender: 'Nữ' }
  ]
};
