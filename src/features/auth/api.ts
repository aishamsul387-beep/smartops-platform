import { apiClient } from '@/services/api/client';
import { ENDPOINTS } from '@/services/api/endpoints';
import type {
  AuthSession,
  AuthUser,
  LoginRequest,
  LoginResponseDto
} from '@/types/auth';

export const authApi = {
  async login(payload: LoginRequest): Promise<AuthSession> {
    const response = await apiClient.post<LoginResponseDto>(
      ENDPOINTS.auth.login,
      payload,
      { requiresAuth: false }
    );

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresAt: response.data.expiresAt,
      user: response.data.user
    };
  },

  async me(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>(ENDPOINTS.auth.me);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<void>(ENDPOINTS.auth.logout, {});
    } catch {
      // fail-safe local logout still proceeds
    }
  }
};