import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  verifyEmail: (token) => API.get(`/auth/verify-email/${token}`),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
  getMe: () => API.get('/auth/me'),
  logout: () => API.get('/auth/logout'),
};

// User APIs
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (userData) => API.put('/users/profile', userData),
  uploadAvatar: (formData) => API.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAccount: () => API.delete('/users/profile'),
  getActivity: () => API.get('/users/activity'),
};

// Video APIs
export const videoAPI = {
  // Public videos (no auth required)
  getPublicVideos: () => API.get('/videos/public'),
  getVideo: (id) => API.get(`/videos/${id}`),
  
  // Protected videos (auth required)
  getMyVideos: () => API.get('/videos/my-videos/all'),
  uploadVideo: (formData) => API.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePrivacy: (id, privacy) => API.put(`/videos/${id}/privacy`, { privacy }),
  deleteVideo: (id) => API.delete(`/videos/${id}`),
  likeVideo: (id) => API.post(`/videos/${id}/like`),
};

export default API;