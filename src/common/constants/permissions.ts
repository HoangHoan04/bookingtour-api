// Enum định nghĩa tất cả các permissions trong hệ thống
export enum Permission {
  // Tours Management
  TOUR_VIEW = 'TOUR_VIEW',
  TOUR_CREATE = 'TOUR_CREATE',
  TOUR_UPDATE = 'TOUR_UPDATE',
  TOUR_DELETE = 'TOUR_DELETE',
  TOUR_APPROVE = 'TOUR_APPROVE',

  // Bookings Management
  BOOKING_VIEW = 'BOOKING_VIEW',
  BOOKING_VIEW_ALL = 'BOOKING_VIEW_ALL', // Xem tất cả booking (admin/manager)
  BOOKING_CREATE = 'BOOKING_CREATE',
  BOOKING_UPDATE = 'BOOKING_UPDATE',
  BOOKING_DELETE = 'BOOKING_DELETE',
  BOOKING_CONFIRM = 'BOOKING_CONFIRM',
  BOOKING_CANCEL = 'BOOKING_CANCEL',
  BOOKING_COMPLETE = 'BOOKING_COMPLETE',

  // Payments Management
  PAYMENT_VIEW = 'PAYMENT_VIEW',
  PAYMENT_PROCESS = 'PAYMENT_PROCESS',
  PAYMENT_REFUND = 'PAYMENT_REFUND',

  // Reviews Management
  REVIEW_VIEW = 'REVIEW_VIEW',
  REVIEW_MODERATE = 'REVIEW_MODERATE',
  REVIEW_APPROVE = 'REVIEW_APPROVE',
  REVIEW_REJECT = 'REVIEW_REJECT',
  REVIEW_RESPOND = 'REVIEW_RESPOND',
  REVIEW_DELETE = 'REVIEW_DELETE',

  // Customers Management
  CUSTOMER_VIEW = 'CUSTOMER_VIEW',
  CUSTOMER_CREATE = 'CUSTOMER_CREATE',
  CUSTOMER_UPDATE = 'CUSTOMER_UPDATE',
  CUSTOMER_DELETE = 'CUSTOMER_DELETE',

  // Users Management
  USER_VIEW = 'USER_VIEW',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_ACTIVATE = 'USER_ACTIVATE',

  // Roles Management
  ROLE_VIEW = 'ROLE_VIEW',
  ROLE_CREATE = 'ROLE_CREATE',
  ROLE_UPDATE = 'ROLE_UPDATE',
  ROLE_DELETE = 'ROLE_DELETE',
  ROLE_ASSIGN = 'ROLE_ASSIGN',

  // Vouchers Management
  VOUCHER_VIEW = 'VOUCHER_VIEW',
  VOUCHER_CREATE = 'VOUCHER_CREATE',
  VOUCHER_UPDATE = 'VOUCHER_UPDATE',
  VOUCHER_DELETE = 'VOUCHER_DELETE',
  VOUCHER_ASSIGN = 'VOUCHER_ASSIGN',

  // Destinations Management
  DESTINATION_VIEW = 'DESTINATION_VIEW',
  DESTINATION_CREATE = 'DESTINATION_CREATE',
  DESTINATION_UPDATE = 'DESTINATION_UPDATE',
  DESTINATION_DELETE = 'DESTINATION_DELETE',

  // Blogs Management
  BLOG_VIEW = 'BLOG_VIEW',
  BLOG_CREATE = 'BLOG_CREATE',
  BLOG_UPDATE = 'BLOG_UPDATE',
  BLOG_DELETE = 'BLOG_DELETE',
  BLOG_PUBLISH = 'BLOG_PUBLISH',
  BLOG_COMMENT_MODERATE = 'BLOG_COMMENT_MODERATE',

  // Notifications
  NOTIFICATION_VIEW = 'NOTIFICATION_VIEW',
  NOTIFICATION_SEND = 'NOTIFICATION_SEND',
  NOTIFICATION_DELETE = 'NOTIFICATION_DELETE',

  // Reports
  REPORT_VIEW = 'REPORT_VIEW',
  REPORT_EXPORT = 'REPORT_EXPORT',

  // Settings
  SETTING_VIEW = 'SETTING_VIEW',
  SETTING_UPDATE = 'SETTING_UPDATE',
}

// Nhóm permissions theo chức năng
export const PermissionGroups = {
  TOUR: [
    Permission.TOUR_VIEW,
    Permission.TOUR_CREATE,
    Permission.TOUR_UPDATE,
    Permission.TOUR_DELETE,
    Permission.TOUR_APPROVE,
  ],
  BOOKING: [
    Permission.BOOKING_VIEW,
    Permission.BOOKING_VIEW_ALL,
    Permission.BOOKING_CREATE,
    Permission.BOOKING_UPDATE,
    Permission.BOOKING_DELETE,
    Permission.BOOKING_CONFIRM,
    Permission.BOOKING_CANCEL,
    Permission.BOOKING_COMPLETE,
  ],
  PAYMENT: [
    Permission.PAYMENT_VIEW,
    Permission.PAYMENT_PROCESS,
    Permission.PAYMENT_REFUND,
  ],
  REVIEW: [
    Permission.REVIEW_VIEW,
    Permission.REVIEW_MODERATE,
    Permission.REVIEW_APPROVE,
    Permission.REVIEW_REJECT,
    Permission.REVIEW_RESPOND,
    Permission.REVIEW_DELETE,
  ],
  CUSTOMER: [
    Permission.CUSTOMER_VIEW,
    Permission.CUSTOMER_CREATE,
    Permission.CUSTOMER_UPDATE,
    Permission.CUSTOMER_DELETE,
  ],
  USER: [
    Permission.USER_VIEW,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_ACTIVATE,
  ],
  ROLE: [
    Permission.ROLE_VIEW,
    Permission.ROLE_CREATE,
    Permission.ROLE_UPDATE,
    Permission.ROLE_DELETE,
    Permission.ROLE_ASSIGN,
  ],
  VOUCHER: [
    Permission.VOUCHER_VIEW,
    Permission.VOUCHER_CREATE,
    Permission.VOUCHER_UPDATE,
    Permission.VOUCHER_DELETE,
    Permission.VOUCHER_ASSIGN,
  ],
  DESTINATION: [
    Permission.DESTINATION_VIEW,
    Permission.DESTINATION_CREATE,
    Permission.DESTINATION_UPDATE,
    Permission.DESTINATION_DELETE,
  ],
  BLOG: [
    Permission.BLOG_VIEW,
    Permission.BLOG_CREATE,
    Permission.BLOG_UPDATE,
    Permission.BLOG_DELETE,
    Permission.BLOG_PUBLISH,
    Permission.BLOG_COMMENT_MODERATE,
  ],
  NOTIFICATION: [
    Permission.NOTIFICATION_VIEW,
    Permission.NOTIFICATION_SEND,
    Permission.NOTIFICATION_DELETE,
  ],
  REPORT: [Permission.REPORT_VIEW, Permission.REPORT_EXPORT],
  SETTING: [Permission.SETTING_VIEW, Permission.SETTING_UPDATE],
};

// Permissions mặc định cho từng vai trò
export const DefaultRolePermissions = {
  ADMIN: Object.values(Permission), // Admin có tất cả quyền

  MANAGER: [
    // Tours
    ...PermissionGroups.TOUR,
    // Bookings
    ...PermissionGroups.BOOKING,
    // Payments
    ...PermissionGroups.PAYMENT,
    // Reviews
    ...PermissionGroups.REVIEW,
    // Customers
    Permission.CUSTOMER_VIEW,
    Permission.CUSTOMER_UPDATE,
    // Vouchers
    ...PermissionGroups.VOUCHER,
    // Destinations
    ...PermissionGroups.DESTINATION,
    // Blogs
    ...PermissionGroups.BLOG,
    // Notifications
    ...PermissionGroups.NOTIFICATION,
    // Reports
    ...PermissionGroups.REPORT,
  ],

  STAFF: [
    // Tours
    Permission.TOUR_VIEW,
    // Bookings
    Permission.BOOKING_VIEW,
    Permission.BOOKING_VIEW_ALL,
    Permission.BOOKING_CREATE,
    Permission.BOOKING_UPDATE,
    Permission.BOOKING_CONFIRM,
    // Payments
    Permission.PAYMENT_VIEW,
    Permission.PAYMENT_PROCESS,
    // Reviews
    Permission.REVIEW_VIEW,
    Permission.REVIEW_MODERATE,
    // Customers
    Permission.CUSTOMER_VIEW,
    Permission.CUSTOMER_CREATE,
    Permission.CUSTOMER_UPDATE,
    // Notifications
    Permission.NOTIFICATION_VIEW,
    Permission.NOTIFICATION_SEND,
  ],

  CUSTOMER: [
    // Chỉ có quyền xem thông tin cá nhân và booking của mình
    Permission.BOOKING_VIEW,
    Permission.BOOKING_CREATE,
    Permission.REVIEW_VIEW,
    Permission.NOTIFICATION_VIEW,
  ],
};

export const enumData = {
  DataType: {
    string: { code: 'string', name: 'Kiểu chuỗi', format: '' },
    int: { code: 'int', name: 'Kiểu số nguyên', format: '' },
    float: { code: 'float', name: 'Kiểu số thập phân', format: '' },
    date: { code: 'date', name: 'Kiểu ngày', format: 'dd/MM/yyyy' },
    dateTime: {
      code: 'dateTime',
      name: 'Kiểu ngày giờ',
      format: 'dd/MM/yyyy HH:mm:ss',
    },
    time: { code: 'time', name: 'Kiểu giờ', format: 'HH:mm:ss' },
    boolean: { code: 'boolean', name: 'Kiểu checkbox', format: '' },
  },

  Gender: {
    MALE: { code: 'MALE', name: 'Nam' },
    FEMALE: { code: 'FEMALE', name: 'Nữ' },
    OTHER: { code: 'OTHER', name: 'Khác' },
  },

  LoginProvider: {
    LOCAL: 'LOCAL',
    ZALO: 'ZALO',
    GOOGLE: 'GOOGLE',
    FACEBOOK: 'FACEBOOK',
  },

  // Vai trò
  ROLES: {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    STAFF: 'STAFF',
    CUSTOMER: 'CUSTOMER',
  },

  // Trạng thái booking
  BOOKING_STATUS: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED',
  },

  // Trạng thái payment
  PAYMENT_STATUS: {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
  },

  // Phương thức thanh toán
  PAYMENT_METHOD: {
    VNPAY: 'VNPAY',
    MOMO: 'MOMO',
    BANK_TRANSFER: 'BANK_TRANSFER',
    CASH: 'CASH',
    CREDIT_CARD: 'CREDIT_CARD',
  },

  // Trạng thái review
  REVIEW_STATUS: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
  },

  // Trạng thái blog
  BLOG_STATUS: {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED',
  },

  // Loại notification
  NOTIFICATION_TYPE: {
    BOOKING: 'BOOKING',
    PAYMENT: 'PAYMENT',
    PROMOTION: 'PROMOTION',
    SYSTEM: 'SYSTEM',
    RECOMMENDATION: 'RECOMMENDATION',
  },

  // Độ ưu tiên notification
  NOTIFICATION_PRIORITY: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT',
  },
};
