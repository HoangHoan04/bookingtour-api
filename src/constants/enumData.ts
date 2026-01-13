export const enumData = {
  DataType: {
    string: { code: 'string', name: 'Kiểu chuỗi', format: '' },
    int: { code: 'int', name: 'Kiểu sổ nguyên', format: '' },
    float: { code: 'float', name: 'Kiểu sổ thập phân', format: '' },
    date: { code: 'date', name: 'Kiểu ngày', format: 'dd/MM/yyyy' },
    dateTime: {
      code: 'dateTime',
      name: 'Kiểu ngày giờ',
      format: 'dd/MM/yyyy HH:mm:ss',
    },
    time: { code: 'time', name: 'Kiểu giờ', format: 'HH:mm:ss' },
    boolean: { code: 'boolean', name: 'Kiểu checkbox', format: '' },
  },

  DayInWeek: {
    SUNDAY: { code: 'SUNDAY', name: 'Chủ nhật' },
    MONDAY: { code: 'MONDAY', name: 'Thứ hai' },
    TUESDAY: { code: 'TUESDAY', name: 'Thứ ba' },
    WEDNESDAY: { code: 'WEDNESDAY', name: 'Thứ tư' },
    THURSDAY: { code: 'THURSDAY', name: 'Thứ năm' },
    FRIDAY: { code: 'FRIDAY', name: 'Thứ sáu' },
    SATURDAY: { code: 'SATURDAY', name: 'Thứ bảy' },
  },

  Gender: {
    MALE: { code: 'MALE', name: 'Nam' },
    FEMALE: { code: 'FEMALE', name: 'Nữ' },
  },

  UserType: {
    Employee: { code: 'Employee', name: 'Nhân viên', description: '' },
    Admin: { code: 'Admin', name: 'Admin', description: '' },
  },

  ActionLogType: {
    CREATE: { code: 'CREATE', name: 'Thêm mới', type: 'ThemMoi' },
    DELETE: { code: 'DELETE', name: 'Xoá bỏ', type: 'XoaBo' },
    UPDATE: { code: 'UPDATE', name: 'Cập nhật', type: 'CapNhat' },
    SYNC: { code: 'SYNC', name: 'Đồng bộ', type: 'DongBo' },
    EDIT: { code: 'EDIT', name: 'Chỉnh sửa', type: 'ChinhSua' },
    APPROVE: { code: 'APPROVE', name: 'Duyệt', type: 'Duyet' },
    SEND_APPROVE: { code: 'SEND_APPROVE', name: 'Gửi Duyệt', type: 'GuiDuyet' },
    REJECT: { code: 'REJECT', name: 'Từ chối', type: 'TuChoi' },
    CANCEL: { code: 'CANCEL', name: 'Huỷ', type: 'Huy' },
    IMPORT_EXCEL: {
      code: 'IMPORT_EXCEL',
      name: 'Nhập excel',
      type: 'NhapExcel',
    },
    ACTIVATE: { code: 'ACTIVATE', name: 'Kích hoạt', type: 'KichHoat' },
    DEACTIVATE: {
      code: 'DEACTIVATE',
      name: 'Ngưng hoạt động',
      type: 'NgungHoatDong',
    },
  },

  EmployeeStatus: {
    PENDING: { code: 'PENDING', name: 'Chờ duyệt', color: '#e8af4f' },
    RECRUITED: { code: 'RECRUITED', name: 'Đã trúng tuyển', color: '#3794bf' },
    WORKING: { code: 'WORKING', name: 'Đang làm việc', color: '#0b5a23' },
    STOP_WORKING: { code: 'STOP_WORKING', name: 'Thôi việc', color: '#f13060' },
    DEACTIVATE: {
      code: 'DEACTIVATE',
      name: 'Ngưng hoạt động',
      color: '#bf4537',
    },
    NOT_APPROVED: {
      code: 'NOT_APPROVED',
      name: 'Từ chối duyệt trúng tuyển',
      color: 'red',
    },
  },

  EmployeeLevel: {
    INTERN: { code: 'INTERN', name: 'Thực tập sinh', color: '#6f42c1' },
    FRESHER: { code: 'FRESHER', name: 'Nhân viên mới', color: '#007bff' },
    JUNIOR: { code: 'JUNIOR', name: 'Nhân viên cấp thấp', color: '#28a745' },
    MIDDLE: { code: 'MIDDLE', name: 'Nhân viên cấp trung', color: '#17a2b8' },
    SENIOR: { code: 'SENIOR', name: 'Nhân viên cấp cao', color: '#ffc107' },
    LEAD: { code: 'LEAD', name: 'Trưởng nhóm', color: '#fd7e14' },
    MANAGER: { code: 'MANAGER', name: 'Quản lý', color: '#6c757d' },
    DIRECTOR: { code: 'DIRECTOR', name: 'Giám đốc', color: '#343a40' },
  },

  EducationLevel: {
    HIGH_SCHOOL: {
      code: 'HIGH_SCHOOL',
      name: 'Trung học phổ thông',
      color: '#6f42c1',
    },
    COLLEGE: { code: 'COLLEGE', name: 'Cao đẳng', color: '#28a745' },
    BACHELOR: { code: 'BACHELOR', name: 'Cử nhân', color: '#007bff' },
    ENGINEER: { code: 'ENGINEER', name: 'Kỹ sư', color: '#17a2b8' },
    MASTER: { code: 'MASTER', name: 'Thạc sĩ', color: '#6f42c1' },
    DOCTOR: { code: 'DOCTOR', name: 'Tiến sĩ', color: '#343a40' },
  },

  WorkingMode: {
    FULLTIME: { code: 'FULLTIME', name: 'Toàn thời gian', color: '#007bff' },
    PART_TIME: { code: 'PART_TIME', name: 'Bán thời gian', color: '#28a745' },
    CONTRACT: { code: 'CONTRACT', name: 'Hợp đồng', color: '#17a2b8' },
    FREELANCE: { code: 'FREELANCE', name: 'Tự do', color: '#6f42c1' },
  },

  ContractType: {
    PROBATION: { code: 'PROBATION', name: 'Thử việc', color: '#007bff' },
    DEFINITE: { code: 'DEFINITE', name: 'Có thời hạn', color: '#28a745' },
    INDEFINITE: { code: 'INDEFINITE', name: 'Vô thời hạn', color: '#17a2b8' },
    SEASONAL: { code: 'SEASONAL', name: 'Theo mùa vụ', color: '#6f42c1' },
  },

  DataScope: {
    ALL: { code: 'ALL', name: 'Xem tất cả dữ liệu hệ thống' },
    BRANCH: {
      code: 'BRANCH',
      name: 'Chỉ xem dữ liệu trong chi nhánh của mình',
    },
    DEPARTMENT: {
      code: 'DEPARTMENT',
      name: 'Chỉ xem dữ liệu trong phòng ban của mình',
    },
    OWN: {
      code: 'OWN',
      name: 'Chỉ xem dữ liệu do chính mình tạo',
    },
    CUSTOM: {
      code: 'CUSTOM',
      name: '(Mở rộng) Dựa trên logic đặc biệt',
    },
  },

  CompanyStatus: {
    ACTIVE: { code: 'ACTIVE', name: 'Hoạt động', color: '#0b5a23' },
    INACTIVE: { code: 'INACTIVE', name: 'Ngưng hoạt động', color: '#bf4537' },
    SUSPENDED: { code: 'SUSPENDED', name: 'Tạm ngưng', color: '#ffc107' },
  },
};

export const millisecondInDay = 86400000;
