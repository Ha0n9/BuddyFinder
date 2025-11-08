// src/services/api.js
import axios from 'axios';
import { showError } from '../utils/toast';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🔐 Authentication failed:', error.response.data);
      
      // Clear auth data
      localStorage.removeItem('token');
      
      // Don't redirect if already on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        showError('Session expired. Please login again.');
        
        // Delay redirect to show toast
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    } else if (error.response?.status >= 500) {
      showError('Server error. Please try again later.');
    } else if (error.response?.data?.message) {
      showError(error.response.data.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// User & Profile
export const getProfile = () => api.get('/profile');
export const getUserProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);

// Search
export const searchBuddies = (params) => api.get('/search/potential', { params });

// Match
export const likeUser = (toUserId) => api.post('/matches/like', { toUserId });
export const passUser = (toUserId) => api.post('/matches/pass', { toUserId });
export const getMatches = () => api.get('/matches');

// Activities
export const postActivity = (data) => api.post('/activities', data);
export const getActivities = () => api.get('/activities');
export const joinActivity = (activityId) => api.post(`/activities/${activityId}/join`);
export const deleteActivity = (activityId) => api.delete(`/activities/${activityId}`);

// Chat
export const sendMessage = (data) => api.post('/chat/send', data);
export const getMessages = (matchId) => api.get(`/chat/messages/${matchId}`);

// Rating
export const submitRating = (data) => api.post('/ratings', data);
export const getRatings = (userId) => api.get(`/ratings/user/${userId}`);
export async function createRating(payload) {
  const res = await fetch("/api/ratings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create rating");
  return res.json();
}


export default api;


// ============== ONLY FOR MOCKING PURPOSES ================
// services/api.js
// import axios from 'axios';

// const USE_MOCK = false;

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Mock users database
// const mockUsers = [
//   {
//     id: 1,
//     email: 'test@example.com',
//     password: '123456',
//     name: 'John Doe',
//     age: 25,
//     interests: 'Gym, Running',
//     location: 'Ha Noi',
//     availability: 'Weekends'
//   }
// ];

// // Mock functions
// const mockLogin = (data) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
//       if (user) {
//         const { password, ...userWithoutPassword } = user;
//         resolve({
//           data: {
//             token: 'mock-jwt-token-' + user.id,
//             user: userWithoutPassword
//           }
//         });
//       } else {
//         reject({ response: { data: { message: 'Invalid credentials' } } });
//       }
//     }, 1000); // Simulate network delay
//   });
// };

// const mockRegister = (data) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // Check if email already exists
//       const existingUser = mockUsers.find(u => u.email === data.email);
//       if (existingUser) {
//         reject({ response: { data: { message: 'Email already exists' } } });
//         return;
//       }

//       const newUser = {
//         id: mockUsers.length + 1,
//         ...data
//       };
//       mockUsers.push(newUser);
      
//       const { password, ...userWithoutPassword } = newUser;
//       resolve({
//         data: {
//           token: 'mock-jwt-token-' + newUser.id,
//           user: userWithoutPassword
//         }
//       });
//     }, 1000);
//   });
// };

// // Export functions
// export const login = (data) => {
//   if (USE_MOCK) {
//     return mockLogin(data);
//   }
//   return api.post('/auth/login', data);
// };

// export const register = (data) => {
//   if (USE_MOCK) {
//     return mockRegister(data);
//   }
//   return api.post('/auth/register', data);
// };

// // Mock other functions
// export const getUserProfile = () => {
//   if (USE_MOCK) {
//     return Promise.resolve({
//       data: JSON.parse(localStorage.getItem('user') || '{}')
//     });
//   }
//   return api.get('/users/profile');
// };

// export const searchBuddies = (filters) => {
//   if (USE_MOCK) {
//     const mockBuddies = [
//       { id: 1, name: 'Sarah', age: 25, location: '2km away', interests: 'Yoga, Running', availability: 'Mornings' },
//       { id: 2, name: 'Mike', age: 28, location: '5km away', interests: 'Weight lifting', availability: 'Evenings' },
//       { id: 3, name: 'Emma', age: 23, location: '1km away', interests: 'Pilates', availability: 'Weekends' },
//     ];
//     return Promise.resolve({ data: mockBuddies });
//   }
//   return api.get('/search', { params: filters });
// };

// // Add other mock functions...

// export const updateProfile = (data) => {
//   if (USE_MOCK) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
//         const updatedUser = { ...currentUser, ...data };
//         localStorage.setItem('user', JSON.stringify(updatedUser));
//         resolve({ data: updatedUser });
//       }, 1000);
//     });
//   }
//   return api.put('/users/profile', data);
// };

// // Cũng thêm các exports khác đang thiếu:
// export const sendBuddyRequest = (data) => {
//   if (USE_MOCK) {
//     return Promise.resolve({ data: { message: 'Buddy request sent!' } });
//   }
//   return api.post('/buddies/request', data);
// };

// export const getMatches = () => {
//   if (USE_MOCK) {
//     const mockMatches = [
//       { id: 1, name: 'Sarah', location: '2km away' },
//       { id: 2, name: 'Mike', location: '5km away' },
//       { id: 3, name: 'Emma', location: '1km away' },
//     ];
//     return Promise.resolve({ data: mockMatches });
//   }
//   return api.get('/buddies/matches');
// };

// export const postActivity = (data) => {
//   if (USE_MOCK) {
//     return Promise.resolve({ data: { id: 1, ...data } });
//   }
//   return api.post('/activities', data);
// };

// export const getActivities = () => {
//   if (USE_MOCK) {
//     const mockActivities = [
//       { id: 1, title: 'Morning Yoga', activityType: 'Yoga', location: 'Central Park', time: '7:00 AM' },
//       { id: 2, title: 'Weight Training', activityType: 'Gym', location: 'Fitness First', time: '6:00 PM' },
//     ];
//     return Promise.resolve({ data: mockActivities });
//   }
//   return api.get('/activities');
// };

// export const joinActivity = (activityId) => {
//   if (USE_MOCK) {
//     return Promise.resolve({ data: { message: 'Joined activity successfully!' } });
//   }
//   return api.post(`/activities/${activityId}/join`);
// };

// export const sendMessage = (data) => {
//   if (USE_MOCK) {
//     return Promise.resolve({ data: { message: 'Message sent!' } });
//   }
//   return api.post('/chat', data);
// };

// export const submitRating = (data) => {
//   if (USE_MOCK) {
//     return Promise.resolve({ data: { message: 'Rating submitted!' } });
//   }
//   return api.post('/ratings', data);
// };

// export const likeUser = (toUserId) => {
//   if (USE_MOCK) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const isMatch = Math.random() > 0.7; // 30% chance match
//         resolve({ 
//           data: { 
//             message: isMatch ? "It's a match! 🎉" : "Like sent!"
//           } 
//         });
//       }, 500);
//     });
//   }
//   return api.post('/matches/like', { toUserId });
// };

// export const passUser = (toUserId) => {
//   if (USE_MOCK) {
//     return Promise.resolve({ data: { message: 'Passed' } });
//   }
//   return api.post('/matches/pass', { toUserId });
// };