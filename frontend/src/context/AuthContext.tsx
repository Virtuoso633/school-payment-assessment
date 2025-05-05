// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';

interface User {
  userId: string;
  username: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Helper functions for cross-browser token storage
  const setToken = (token: string) => {
    try {
      localStorage.setItem('token', token);
      
      // Set cookie with appropriate SameSite attribute based on environment
      const isLocalhost = window.location.hostname === 'localhost';
      const cookieOptions = isLocalhost
        ? `token=${token}; path=/; max-age=86400`
        : `token=${token}; path=/; max-age=86400; SameSite=None; Secure`;
      
      document.cookie = cookieOptions;
      
    } catch (error) {
      console.error('Error saving token', error);
    }
  };

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

  const removeToken = () => {
    try {
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure';
    } catch (error) {
      console.error('Error removing token', error);
    }
  };
  
  useEffect(() => {
    // Check if token exists and initialize user state
    const token = getToken();
    if (token) {
      try {
        // Decode the JWT to get user info
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser({
          userId: decoded.sub,
          username: decoded.username,
        });
      } catch (error) {
        console.error('Failed to decode token', error);
        removeToken();
      }
    }
    setLoading(false);
  }, []);
  
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ username, password });
      setToken(response.access_token);
      
      // Decode JWT token to get user info
      const decoded = JSON.parse(atob(response.access_token.split('.')[1]));
      setUser({
        userId: decoded.sub,
        username: decoded.username,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (username: string, password: string, email?: string) => {
    setLoading(true);
    try {
      await authService.register({ username, password, email });
      // After registration, auto-login the user
      await login(username, password);
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    authService.logout();
    removeToken();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated: !!user, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};