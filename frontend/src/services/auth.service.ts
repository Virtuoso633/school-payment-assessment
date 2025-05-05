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
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Use the updated setToken function
      const token = response.data.access_token;
      try {
        localStorage.setItem('token', token);
        
        // Set cookie with appropriate SameSite attribute
        const isLocalhost = window.location.hostname === 'localhost';
        const cookieOptions = isLocalhost
          ? `token=${token}; path=/; max-age=86400`
          : `token=${token}; path=/; max-age=86400; SameSite=None; Secure`;
        
        document.cookie = cookieOptions;
        
      } catch (error) {
        console.error('Error saving token', error);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
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