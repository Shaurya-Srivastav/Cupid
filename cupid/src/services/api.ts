// src/services/api.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Ensure cookies are sent with requests
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          {
            withCredentials: true, // Send cookies (refresh token)
          }
        );

        const newToken = response.data.accessToken;
        localStorage.setItem('token', newToken);

        // Update the authorization header and retry the original request
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
