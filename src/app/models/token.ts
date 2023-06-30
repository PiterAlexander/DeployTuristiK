export interface Token {
  success: boolean;
  message: string;
  result: string;
}

export interface UserLog {
  sub: string;
  jti: string;
  iat: string;
  id: string;
  userName: string;
  email: string;
  iss: string;
  aud: string;
  role?: string;
  roleId?: string;
}
