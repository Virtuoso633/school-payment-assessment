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

// Add helper function for cross-browser token storage
const getToken = (): string | null => {
  try {
    // Try localStorage first
    const token = localStorage.getItem('token');
    if (token) return token;
    
    // Fall back to cookies
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  } catch (error) {
    console.error('Error retrieving token', error);
    return null;
  }
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('Making login request to:', `${api.defaults.baseURL}/auth/login`);
      
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      console.log('Login response received:', response.status);
      
      // Store token in both localStorage and cookies for cross-browser compatibility
      try {
        localStorage.setItem('token', response.data.access_token);
        
        // More compatible cookie setting
        document.cookie = `token=${response.data.access_token}; path=/; max-age=86400`;
        
        console.log('Token stored successfully');
      } catch (error) {
        console.error('Error saving token', error);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        headers: error.config?.headers
      });
      throw error;
    }
  },
  
  register: async (userData: RegisterRequest): Promise<any> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Update logout method to clear both localStorage and cookies
  logout: (): void => {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure';
  },
  
  // Update isAuthenticated method to check both storage methods
  isAuthenticated: (): boolean => {
    return getToken() !== null;
  }
};