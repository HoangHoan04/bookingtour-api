export interface TokenPayload {
  uid: string;
  isRefreshToken?: boolean;
}

export interface AuthResponse {
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  isAdmin: boolean;
  isActive: boolean;
  lastLogin: Date;
  customer?: any;
  employee?: any;
  roles?: any[];
}

export interface OAuthUserData {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
}
