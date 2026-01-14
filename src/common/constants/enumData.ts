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

  PERMISSION_ACTION: {
    ADD: { code: 'isAdd', name: 'Thêm mới' },
    VIEW: { code: 'isView', name: 'Xem' },
    EDIT: { code: 'isEdit', name: 'Chỉnh sửa' },
    DELETED: { code: 'isDeleted', name: 'Xóa' },
    ACTIVATED: { code: 'isActivated', name: 'Kích hoạt' },
    EXPORT: { code: 'isExport', name: 'Xuất' },
    IMPORT: { code: 'isImport', name: 'Nhập' },
    APPROVED: { code: 'isApproved', name: 'Duyệt' },
    REJECT: { code: 'isReject', name: 'Từ chối' },
    ASSIGN: { code: 'isAssign', name: 'Gán' },
    SEND_APPROVED: { code: 'isSendApproved', name: 'Gửi duyệt' },
    CANCELLED: { code: 'isCancelled', name: 'Hủy' },
    COMPLETED: { code: 'isCompleted', name: 'Hoàn thành' },
  },

  PERMISSIONS: {
    REPORT: {
      KEY: 'REPORT',
      OVERVIEW: 'REPORT-OVERVIEW',
      INVENTORY: 'REPORT-INVENTORY',
    },

    ACCOUNTING: {
      KEY: 'ACCOUNTING',
      DEBT_SUPPLIER: 'ACCOUNTING-DEBT-SUPPLIER',
      MISA_PAYMENT: 'ACCOUNTING-MISA-PAYMENT',
      CHECKING_INVENTORY: 'ACCOUNTING-CHECKING-INVENTORY',
      DISBURSEMENT: 'ACCOUNTING-DISBURSEMENT',
    },

    SALE_IPOS: {
      KEY: 'SALE-IPOS',
      SALES_POWER: 'SALE-IPOS-SALES-POWER',
      UPLOAD_SALES: 'SALE-IPOS-UPLOAD-SALES',
      DESTRUCTIVE_LIST: 'SALE-IPOS-DESTRUCTIVE-LIST',
      UPLOAD_DESTRUCTIVE: 'SALE-IPOS-UPLOAD-DESTRUCTIVE',
    },

    PURCHASING: {
      KEY: 'PURCHASING',
      PLAN_TYPE: 'PURCHASING-PLAN-TYPE',
      PLAN: 'PURCHASING-PLAN',
      DISBURSEMENT: 'PURCHASING-DISBURSEMENT-DISBURSEMENT',
      MISA_EXPORT: 'PURCHASING-DISBURSEMENT-MISA-EXPORT',
      SUMMARY_ORDER: 'PURCHASING-ORDER-SUMMARY-ORDER',
      ORDER: 'PURCHASING-ORDER-ORDER',
      CREATE: 'PURCHASING-REQUEST-CREATE',
      LIST: 'PURCHASING-REQUEST-LIST',
    },

    PRICE_MAKING: {
      KEY: 'PRICE-MAKING',
      SUPPLIER: 'PRICE-MAKING-SUPPLIER',
      ITEM: 'PRICE-MAKING-ITEM',
      EQUIPMENT: 'PRICE-MAKING-EQUIPMENT',
      MATERIAL: 'PRICE-MAKING-MATERIAL',
      PROPERTY: 'PRICE-MAKING-PROPERTY',
    },

    INVENTORY: {
      KEY: 'INVENTORY',
      DELIVERY_NOTE: 'INVENTORY-DELIVERY-NOTE',
      RECEIVE: 'INVENTORY-RECEIVE',
      MISA_GROUP: 'INVENTORY-MISA-GROUP', // Nhóm Misa trong kho
      RETURN: 'INVENTORY-RETURN',
      OUTBOUND: 'INVENTORY-OUTBOUND',
      STOCK: 'INVENTORY-STOCK',
      TRANSFER_WAREHOUSE: 'INVENTORY-TRANSFER-WAREHOUSE',
      CHECK: 'INVENTORY-CHECK',
      CANCEL: 'INVENTORY-CANCEL',
      LIQUIDATION: 'INVENTORY-LIQUIDATION',
      BRANCH_REQUISITION: 'INVENTORY-BRANCH-REQUISITION',
      BRANCH_RETURN: 'INVENTORY-BRANCH-RETURN',
    },

    MANUFACTURE_PRODUCTION: {
      KEY: 'MANUFACTURE-PRODUCTION',
      RECIPE: 'MANUFACTURE-PRODUCTION-RECIPE',
      RECIPE_TEST: 'MANUFACTURE-PRODUCTION-RECIPE-TEST',
      ITEM_CODE: 'MANUFACTURE-PRODUCTION-ITEM-CODE',
      PLAN_CREATE: 'MANUFACTURE-PRODUCTION-PLAN-CREATE',
      PLAN_LIST: 'MANUFACTURE-PRODUCTION-PLAN-LIST',
      PROCESS_LINE: 'MANUFACTURE-PRODUCTION-PROCESS-LINE',
    },
    MANUFACTURE_PREPARATION: {
      KEY: 'MANUFACTURE-PREPARATION',
      SETTING: 'MANUFACTURE-PREPARATION-SETTING',
      EXECUTE: 'MANUFACTURE-PREPARATION-EXECUTE',
    },

    SETTING_GENERAL: {
      KEY: 'SETTING-GENERAL',
      COMPANY: 'SETTING-GENERAL-COMPANY',
      BRAND: 'SETTING-GENERAL-BRAND',
      BRANCH: 'SETTING-GENERAL-BRANCH',
      DEPARTMENT: 'SETTING-GENERAL-DEPARTMENT',
      PART: 'SETTING-GENERAL-PART',
      EMPLOYEE: 'SETTING-GENERAL-EMPLOYEE',
    },
    SETTING_PRODUCT: {
      KEY: 'SETTING-PRODUCT',
      UNIT: 'SETTING-PRODUCT-UNIT',
      ITEM: 'SETTING-PRODUCT-ITEM',
      ITEM_GROUP: 'SETTING-PRODUCT-ITEM-GROUP',
      ITEM_INDUSTRY: 'SETTING-PRODUCT-ITEM-INDUSTRY',
      ITEM_GROUP_SELL: 'SETTING-PRODUCT-ITEM-GROUP-SELL',
      PROPERTY: 'SETTING-PRODUCT-PROPERTY',
      PROPERTY_TYPE: 'SETTING-PRODUCT-PROPERTY-TYPE',
      EQUIPMENT: 'SETTING-PRODUCT-EQUIPMENT',
      EQUIPMENT_TYPE: 'SETTING-PRODUCT-EQUIPMENT-TYPE',
      MATERIAL: 'SETTING-PRODUCT-MATERIAL',
      MATERIAL_TYPE: 'SETTING-PRODUCT-MATERIAL-TYPE',
      STANDARDS: 'SETTING-PRODUCT-STANDARDS',
      VTTH_STANDARDS: 'SETTING-PRODUCT-VTTH-STANDARDS',
    },
    SETTING_PERMISSION: {
      KEY: 'SETTING-PERMISSION',
      ROLE: 'SETTING-PERMISSION-ROLE',
      ASSIGN: 'SETTING-PERMISSION-ASSIGN',
    },
    SETTING_DYNAMIC: {
      KEY: 'SETTING-DYNAMIC',
      CONFIG: 'SETTING-DYNAMIC-CONFIG',
    },

    //#region mobile
    MOBILE: {
      KEY: 'MOBILE',
      ORDER_TAB: {
        code: 'ORDERTAB',
        controller: 'ORDER_TAB',
      },
      LIQUIDATION_ITEM_TAB: {
        code: 'LIQUIDATIONITEMTAB',
        controller: 'LIQUIDATION_ITEM_TAB',
      },
      REQUEST_PRODUCTS_TAB: {
        code: 'REQUESTPRODUCTSTAB',
        controller: 'REQUEST_PRODUCTS_TAB',
      },
      GIVE_ITEM_TAB: {
        code: 'GIVEITEMTAB',
        controller: 'GIVE_ITEM_TAB',
      },
      RECEIVED_ITEM_TAB: {
        code: 'RECEIVEDITEMTAB',
        controller: 'RECEIVED_ITEM_TAB',
      },
      CANCEL_ITEM_TAB: {
        code: 'CANCELITEMTAB',
        controller: 'CANCEL_ITEM_TAB',
      },
      INVENTORY_TAB: {
        code: 'INVENTORYTAB',
        controller: 'INVENTORY_TAB',
      },
      WAREHOUSE_TRANSFER_TAB: {
        code: 'WAREHOUSETRANSFERTAB',
        controller: 'WAREHOUSE_TRANSFER_TAB',
      },
      INVENTORY_CHECK_TAB: {
        code: 'INVENTORYCHECKTAB',
        controller: 'INVENTORY_CHECK_TAB',
      },
    },
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
