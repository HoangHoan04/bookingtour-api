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
    OTHER: { code: 'OTHER', name: 'Khác' },
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
    RESTORE: { code: 'RESTORE', name: 'Khôi phục', type: 'KhoiPhuc' },
  },

  OTPSendMethod: {
    ZALO: 'ZALO',
    EMAIL: 'EMAIL',
  },

  TypeField: {
    TEXT: 'TEXT',
    NUMBER: 'NUMBER',
    BOOLEAN: 'BOOLEAN',
    DATE: 'DATE',
    JSON: 'JSON',
  },

  SettingTab: {
    SYSTEM: 'SYSTEM',
  },

  TemplateZalo: {
    ZNS_TEMPLATE_ID_SEND_OTP: '',
  },

  LoginProvider: {
    LOCAL: 'LOCAL',
    ZALO: 'ZALO',
    GOOGLE: 'GOOGLE',
    FACEBOOK: 'FACEBOOK',
  },

  BOOKING_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ xác nhận', color: 'yellow' },
    CONFIRMED: { code: 'CONFIRMED', name: 'Đã xác nhận', color: 'blue' },
    COMPLETED: { code: 'COMPLETED', name: 'Hoàn thành', color: 'green' },
    CANCELLED: { code: 'CANCELLED', name: 'Đã hủy', color: 'red' },
    EXPIRED: { code: 'EXPIRED', name: 'Hết hạn', color: 'gray' },
  },

  BOOKING_DETAIL_STATUS: {
    ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động', color: 'green' },
    CANCELLED: { code: 'CANCELLED', name: 'Đã hủy', color: 'red' },
  },

  PAYMENT_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ xử lý', color: 'yellow' },
    CONFIRMED: { code: 'CONFIRMED', name: 'Đã xác nhận', color: 'blue' },
    SUCCESS: { code: 'SUCCESS', name: 'Thành công', color: 'green' },
    FAILED: { code: 'FAILED', name: 'Thất bại', color: 'red' },
    EXPIRED: { code: 'EXPIRED', name: 'Hết hạn', color: 'gray' },
    CANCELLED: { code: 'CANCELLED', name: 'Đã hủy', color: 'red' },
  },

  PAYMENT_METHOD: {
    VNPAY: { code: 'VNPAY', name: 'VNPAY' },
    MOMO: { code: 'MOMO', name: 'MOMO' },
    BANK_TRANSFER: { code: 'BANK_TRANSFER', name: 'Chuyển khoản ngân hàng' },
    CASH: { code: 'CASH', name: 'Tiền mặt' },
    CREDIT_CARD: { code: 'CREDIT_CARD', name: 'Thẻ tín dụng' },
  },

  REVIEW_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ duyệt', color: 'yellow' },
    APPROVED: { code: 'APPROVED', name: 'Đã duyệt', color: 'green' },
    REJECTED: { code: 'REJECTED', name: 'Từ chối', color: 'red' },
  },

  BLOG_STATUS: {
    NEW: { code: 'NEW', name: 'Mới tạo' },
    DRAFT: { code: 'DRAFT', name: 'Bản nháp' },
    PUBLISHED: { code: 'PUBLISHED', name: 'Đã xuất bản' },
    ARCHIVED: { code: 'ARCHIVED', name: 'Lưu trữ' },
    REJECT: { code: 'REJECT', name: 'Từ chối xuất bản' },
  },

  BLOG_COMMENT_STATUS: {
    PENDING: { code: 'PENDING', name: 'Chờ duyệt', color: 'yellow' },
    APPROVED: { code: 'APPROVED', name: 'Đã duyệt', color: 'green' },
    REJECTED: { code: 'REJECTED', name: 'Từ chối', color: 'red' },
  },

  NOTIFICATION_TYPE: {
    BOOKING: { code: 'BOOKING', name: 'Đặt chỗ' },
    PAYMENT: { code: 'PAYMENT', name: 'Thanh toán' },
    PROMOTION: { code: 'PROMOTION', name: 'Khuyến mãi' },
    SYSTEM: { code: 'SYSTEM', name: 'Hệ thống' },
    RECOMMENDATION: { code: 'RECOMMENDATION', name: 'Gợi ý' },
  },

  NOTIFICATION_PRIORITY: {
    LOW: { code: 'LOW', name: 'Thấp' },
    MEDIUM: { code: 'MEDIUM', name: 'Trung bình' },
    HIGH: { code: 'HIGH', name: 'Cao' },
    URGENT: { code: 'URGENT', name: 'Khẩn cấp' },
  },

  TOUR_STATUS: {
    DRAFT: { code: 'DRAFT', name: 'Bản nháp' },
    ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động' },
    INACTIVE: { code: 'INACTIVE', name: 'Ngưng hoạt động' },
  },

  TOUR_DETAIL_STATUS: {
    ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động' },
    INACTIVE: { code: 'INACTIVE', name: 'Ngưng hoạt động' },
  },

  TOUR_ITINERARIE_STATUS: {
    ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động' },
    INACTIVE: { code: 'INACTIVE', name: 'Ngưng hoạt động' },
  },

  TOUR_PRICE_STATUS: {
    ACTIVE: { code: 'ACTIVE', name: 'Đang hoạt động' },
    INACTIVE: { code: 'INACTIVE', name: 'Ngưng hoạt động' },
  },
  Tour_Price_Type: {
    ADULT: { code: 'ADULT', name: 'Người lớn' },
    CHILD: { code: 'CHILD', name: 'Trẻ em' },
    INFANT: { code: 'INFANT', name: 'Em bé' },
    VIP: { code: 'VIP', name: 'VIP' },
  },
  BANNER_STATUS: {
    FRESHLY_CREATED: { code: 'FRESHLY_CREATED', name: 'Mới tạo' },
    IN_EFFECT: { code: 'IN_EFFECT', name: 'Đang hiệu lực' },
    EXPIRED: { code: 'EXPIRED', name: 'Hết hiệu lực' },
  },

  NEW_STATUS: {
    FRESHLY_CREATED: { code: 'FRESHLY_CREATED', name: 'Mới tạo' },
    IN_EFFECT: { code: 'IN_EFFECT', name: 'Đang hiệu lực' },
    EXPIRED: { code: 'EXPIRED', name: 'Hết hiệu lực' },
  },

  BANNER_TYPE: {
    HOME: { code: 'HOME', name: 'Trang chủ' },
    ABOUT: { code: 'ABOUT', name: 'Giới thiệu' },
    BLOG: { code: 'BLOG', name: 'Blog' },
    SERVICES: { code: 'SERVICES', name: 'Dịch vụ' },
    TOUR: { code: 'TOUR', name: 'Tour' },
    BOOKING: { code: 'BOOKING', name: 'Đặt tour' },
    NEWS: { code: 'NEWS', name: 'Tin tức' },
    FAQ: { code: 'FAQ', name: 'Câu hỏi thường gặp' },
  },

  TRAVEL_TYPE: {
    ALL: { code: 'ALL', name: 'Tất cả' },
    DOMESTIC: { code: 'DOMESTIC', name: 'Trong nước' },
    INTERNATIONAL: { code: 'INTERNATIONAL', name: 'Nước ngoài' },
  },
};

export const millisecondInDay = 86400000;
export const SUCCESS = 0;
export const ACCESS_TOKEN_INVALID = -216;
export const OA_ID_INVALID = -217;
export const REFRESH_TOKEN_EXPIRED = -14005;
export const INVALID_REFRESH_TOKEN = -14006;

export const SettingString = {
  ZALO_REFRESH_TOKEN: {
    code: 'ZALO_REFRESH_TOKEN',
    name: 'Zalo Refresh Token',
    value: '',
    type: enumData.TypeField.TEXT,
    settingTab: enumData.SettingTab.SYSTEM,
    isHidden: true,
  },
  ZALO_ACCESS_TOKEN: {
    code: 'ZALO_ACCESS_TOKEN',
    name: 'Zalo Access Token',
    value: '',
    type: enumData.TypeField.TEXT,
    settingTab: enumData.SettingTab.SYSTEM,
    isHidden: true,
  },
  CHECK_ZALO: {
    code: 'CHECK_ZALO',
    name: 'Check_Zalo',
    value: '',
    type: enumData.TypeField.TEXT,
    settingTab: enumData.SettingTab.SYSTEM,
    isHidden: false,
  },
};

export const enumZalo = {
  ErrorCodeTableZalo: {
    '-124': { code: -124, message: 'Số điện thoại không hợp lệ' },
    '-201': { code: -201, message: 'Template không tồn tại' },
    '-214': { code: -214, message: 'Số dư tài khoản không đủ' },
    '-216': { code: -216, message: 'Access token không hợp lệ' },
    '-217': { code: -217, message: 'OA ID không hợp lệ' },
  },
};
