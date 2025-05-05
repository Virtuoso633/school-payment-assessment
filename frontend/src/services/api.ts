// // src/services/api.ts
// import axios from 'axios';

// const API_URL = 'https://35.154.69.40'; // Change to your backend URL

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Important for CORS with credentials
// });

// // Add request interceptor to attach JWT token with Safari compatibility
// api.interceptors.request.use(
//   (config) => {
//     // Try localStorage first (works in most browsers)
//     let token = localStorage.getItem('token');
    
//     // If localStorage fails (like in Safari private mode), try cookies
//     if (!token) {
//       const cookies = document.cookie.split(';');
//       const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
//       if (tokenCookie) {
//         token = tokenCookie.split('=')[1];
//       }
//     }
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add response interceptor for token expiration
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Clear token from both localStorage and cookies
//       localStorage.removeItem('token');
//       document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure';
//       window.location.href = '/login';
//     }
    
//     // Log detailed error information for debugging
//     console.error('[API Error]', {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data,
//       browser: navigator.userAgent
//     });
    
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

const API_URL = 'https://35.154.69.40'; // or process.env.REACT_APP_API_BASE_URL

console.log('API base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // Add timeout
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    // Try to get token from localStorage or cookie
    let token;
    try {
      token = localStorage.getItem('token');
      
      if (!token) {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }
    } catch (error) {
      console.error('Error accessing storage:', error);
    }
    
    // Add token to auth header if found
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

export default api;
export { api };