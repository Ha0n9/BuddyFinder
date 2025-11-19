// src/services/api.js
import axios from 'axios';
import { showError } from '../utils/toast';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== REQUEST INTERCEPTOR ==========
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== RESPONSE INTERCEPTOR ==========
let lastToastMessage = null;
let lastToastTime = 0;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';
    const url = error.config?.url || '';
    const now = Date.now();

    // Prevent duplicate toasts within 1 second
    const maybeToast = (msg) => {
      if (msg === lastToastMessage && now - lastToastTime < 1000) return;
      lastToastMessage = msg;
      lastToastTime = now;
      showError(msg);
    };

    // Do not show toast for login/register (handled in forms)
    if (url.includes('/auth/login') || url.includes('/auth/register')) {
      return Promise.reject(error);
    }

    // ====== ERROR HANDLING ======
    if (status === 401) {
      console.error('🔐 Authentication failed:', error.response?.data);
      localStorage.removeItem('token');
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        maybeToast('Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    } else if (status === 403) {
      const token = localStorage.getItem('token');
      if (!token) return Promise.reject(error);

      if (url.includes('/admin/')) {
        maybeToast('Access denied: Admin privileges required.');
      } else if (message.toLowerCase().includes('banned')) {
        maybeToast('Your account has been banned. Please contact support.');
      } else {
        maybeToast(message || 'Access denied.');
      }
    } else if (status >= 500) {
      maybeToast('Server error. Please try again later.');
    } else if (message) {
      maybeToast(message);
    }

    return Promise.reject(error);
  }
);

// ================== AUTH ==================
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// ================== USER & PROFILE ==================
export const getProfile = () => api.get('/profile');
export const getUserProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);
export const deleteAccount = (password) =>
  api.delete('/users/account', { data: { password } });

// ================== SEARCH ==================
export const searchBuddies = (params) => api.get('/search/potential', { params });

// ================== MATCH ==================
export const likeUser = (toUserId) => api.post('/matches/like', { toUserId });
export const passUser = (toUserId) => api.post('/matches/pass', { toUserId });
export const getMatches = () => api.get('/matches');

// ================== ACTIVITIES ==================
export const postActivity = (data) => api.post('/activities/create', data);
export const getActivities = () => api.get('/activities');
export const joinActivity = (activityId) => api.post(`/activities/${activityId}/join`);
export const deleteActivity = (activityId) => api.delete(`/activities/${activityId}`);

// ================== CHAT (1-1) ==================
export const sendMessage = (data) => api.post('/chat/send', data);
export const getMessages = (matchId) => api.get(`/chat/messages/${matchId}`);

// ================== GROUP CHAT (ACTIVITY CHAT) ==================
export const getActivityChatRoom = (activityId) =>
  api.get(`/activities/${activityId}/chat-room`);

export const getGroupMessages = (roomId) =>
  api.get(`/group-chat/rooms/${roomId}/messages`);

export const getGroupMembers = (roomId) =>
  api.get(`/group-chat/rooms/${roomId}/members`);

export const leaveGroupChat = (roomId) =>
  api.post(`/group-chat/rooms/${roomId}/leave`);

export const getMyGroupChats = () => api.get('/group-chat/rooms/me');

// ================== REPORTS ==================
export const submitReport = (payload) => api.post('/reports', payload);
export const getFiledReports = () => api.get('/reports/filed');
export const getReportsAgainstMe = () => api.get('/reports/against-me');
export const getReportById = (reportId) => api.get(`/reports/${reportId}`);
export const addReportMessage = (reportId, payload) =>
  api.post(`/reports/${reportId}/messages`, payload);

// ================== RATING ==================
export const submitRating = (data) => api.post('/ratings', data);
export const getRatings = (userId) => api.get(`/ratings/user/${userId}`);
export const createRating = async (payload) => {
  const response = await api.post('/ratings', payload);
  return response.data;
};

export const getUserById = (userId) => api.get(`/users/${userId}`);

// ================== NOTIFICATIONS ==================
export const getNotifications = () => api.get('/notifications');
export const markNotificationAsRead = (notiId) => api.put(`/notifications/${notiId}/read`);
export const markAllNotificationsAsRead = () => api.put('/notifications/read-all');
export const deleteNotification = (notiId) => api.delete(`/notifications/${notiId}`);

// ================== REFERRAL ==================
export async function getReferralInfo() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8080/api/referral/info', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch referral info');
  return res.json();
}

// ================== PROFILE MEDIA ==================
export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/profile/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
