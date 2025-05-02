// src/services/auth.service.ts
import api from './api';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

interface AuthResponse {
  access_token: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: RegisterRequest): Promise<any> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: (): void => {
    localStorage.removeItem('token');
  },
  
  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  }
};