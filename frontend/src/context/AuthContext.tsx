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
  
  useEffect(() => {
    // Check if token exists and initialize user state
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // In a real app, you would decode the JWT or make an API call to get user info
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser({
          userId: decoded.sub,
          username: decoded.username,
        });
      } catch (error) {
        console.error('Failed to decode token', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);
  
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ username, password });
      localStorage.setItem('token', response.access_token);
      
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