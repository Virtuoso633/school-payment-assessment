// src/services/api.ts
import axios from 'axios';

const API_URL = 'https://35.154.69.40'; // Change to your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Add request interceptor to attach JWT token with Safari compatibility
api.interceptors.request.use(
  (config) => {
    // Try localStorage first (works in most browsers)
    let token = localStorage.getItem('token');
    
    // If localStorage fails (like in Safari private mode), try cookies
    if (!token) {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token from both localStorage and cookies
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure';
      window.location.href = '/login';
    }
    
    // Log detailed error information for debugging
    console.error('[API Error]', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      browser: navigator.userAgent
    });
    
    return Promise.reject(error);
  }
);

export default api;