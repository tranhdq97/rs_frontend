export enum EAFileManagement {
  CREATE = "/api/file-management/create",
  LIST = "/api/file-management/list",
  DETAIL = "/api/file-management/:id/detail",
  UPDATE = "/api/file-management/:id/update",
  DELETE = "/api/file-management/:id/delete",
}

export enum EAAddress {}

export enum EAAuth {
  TOKEN = "/api/auth/token",
  REFRESH_TOKEN = "/api/auth/token/refresh",
  GET_ME = "/api/auth/get-me",
  CHANGE_PASSWORD = "api/auth/change-password",
}

export enum EACustomer {
  CREATE = "/api/customer/create",
  LIST = "/api/customer/list",
  DETAIL = "/api/customer/:id/detail",
  DELETE = "/api/customer/:id/delete",
  UPDATE = "/api/customer/:id/update",
}

export enum EAMaster {
  CREATE = "api/master/:master_name/create",
  LIST = "api/master/:master_name/list",
  DELETE = "api/master/:master_name/:id/list",
}

export enum EAMenu {
  CREATE = "/api/menu/create",
  LIST = "/api/menu/list",
  DETAIL = "/api/menu/:id/detail",
  UPDATE = "/api/menu/:id/update",
  DELETE = "/api/menu/:id/delete",
}

export enum EAOrder {
  CREATE = "/api/order/create",
  LIST = "/api/order/list",
  DETAIL = "/api/order/:id/detail",
  UPDATE = "/api/order/:id/update",
  DELETE = "/api/order/:id/delete",
}
export enum EAOrderItem {
  CREATE = "/api/order_item/create",
  LIST = "/api/order_item/list",
  DETAIL = "/api/order_item/:id/detail",
  UPDATE = "/api/order_item/:id/update",
  DELETE = "/api/order_item/:id/delete",
}
export enum EAProfile {
  CREATE = "/api/profile/create",
  DETAIL = "/api/profile/:id/detail",
  UPDATE = "/api/profile/:id/update",
  DELETE = "/api/profile/:id/delete",
}

export enum EAStaff {
  CREATE = "/api/staff/create",
  LIST = "/api/staff/list",
  DETAIL = "/api/staff/:id/detail",
  UPDATE = "/api/staff/:id/update",
  DELETE = "/api/staff/:id/delete",
}

export enum EATable {
  CREATE = "/api/table/create",
  LIST = "/api/table/list",
  DETAIL = "/api/table/:id/detail",
  UPDATE = "/api/table/:id/update",
  DELETE = "/api/table/:id/delete",
}
