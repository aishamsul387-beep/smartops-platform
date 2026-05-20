import type { Permission } from './permissions';
import type { Role } from './roles';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions?: Permission[];
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  user: AuthUser;
}
