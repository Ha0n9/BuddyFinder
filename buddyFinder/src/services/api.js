// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const login = (data) => api.post('/auth/login', data);
// export const register = (data) => api.post('/auth/register', data);
// export const getUserProfile = () => api.get('/users/profile');
// export const updateProfile = (data) => api.put('/users/profile', data);
// export const searchBuddies = (filters) => api.get('/search', { params: filters });
// export const sendBuddyRequest = (data) => api.post('/buddies/request', data);
// export const getMatches = () => api.get('/buddies/matches');
// export const postActivity = (data) => api.post('/activities', data);
// export const getActivities = () => api.get('/activities');
// export const joinActivity = (activityId) => api.post(`/activities/${activityId}/join`);
// export const sendMessage = (data) => api.post('/chat', data);
// export const submitRating = (data) => api.post('/ratings', data);


// services/api.js
import axios from 'axios';

const USE_MOCK = true; // Set thành false khi có backend thật

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock users database
const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    password: '123456',
    name: 'John Doe',
    age: 25,
    interests: 'Gym, Running',
    location: 'Ha Noi',
    availability: 'Weekends'
  }
];

// Mock functions
const mockLogin = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        resolve({
          data: {
            token: 'mock-jwt-token-' + user.id,
            user: userWithoutPassword
          }
        });
      } else {
        reject({ response: { data: { message: 'Invalid credentials' } } });
      }
    }, 1000); // Simulate network delay
  });
};

const mockRegister = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        reject({ response: { data: { message: 'Email already exists' } } });
        return;
      }

      const newUser = {
        id: mockUsers.length + 1,
        ...data
      };
      mockUsers.push(newUser);
      
      const { password, ...userWithoutPassword } = newUser;
      resolve({
        data: {
          token: 'mock-jwt-token-' + newUser.id,
          user: userWithoutPassword
        }
      });
    }, 1000);
  });
};

// Export functions
export const login = (data) => {
  if (USE_MOCK) {
    return mockLogin(data);
  }
  return api.post('/auth/login', data);
};

export const register = (data) => {
  if (USE_MOCK) {
    return mockRegister(data);
  }
  return api.post('/auth/register', data);
};

// Mock other functions
export const getUserProfile = () => {
  if (USE_MOCK) {
    return Promise.resolve({
      data: JSON.parse(localStorage.getItem('user') || '{}')
    });
  }
  return api.get('/users/profile');
};

export const searchBuddies = (filters) => {
  if (USE_MOCK) {
    const mockBuddies = [
      { id: 1, name: 'Sarah', age: 25, location: '2km away', interests: 'Yoga, Running', availability: 'Mornings' },
      { id: 2, name: 'Mike', age: 28, location: '5km away', interests: 'Weight lifting', availability: 'Evenings' },
      { id: 3, name: 'Emma', age: 23, location: '1km away', interests: 'Pilates', availability: 'Weekends' },
    ];
    return Promise.resolve({ data: mockBuddies });
  }
  return api.get('/search', { params: filters });
};

// Add other mock functions...

export const updateProfile = (data) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        resolve({ data: updatedUser });
      }, 1000);
    });
  }
  return api.put('/users/profile', data);
};

// Cũng thêm các exports khác đang thiếu:
export const sendBuddyRequest = (data) => {
  if (USE_MOCK) {
    return Promise.resolve({ data: { message: 'Buddy request sent!' } });
  }
  return api.post('/buddies/request', data);
};

export const getMatches = () => {
  if (USE_MOCK) {
    const mockMatches = [
      { id: 1, name: 'Sarah', location: '2km away' },
      { id: 2, name: 'Mike', location: '5km away' },
      { id: 3, name: 'Emma', location: '1km away' },
    ];
    return Promise.resolve({ data: mockMatches });
  }
  return api.get('/buddies/matches');
};

export const postActivity = (data) => {
  if (USE_MOCK) {
    return Promise.resolve({ data: { id: 1, ...data } });
  }
  return api.post('/activities', data);
};

export const getActivities = () => {
  if (USE_MOCK) {
    const mockActivities = [
      { id: 1, title: 'Morning Yoga', activityType: 'Yoga', location: 'Central Park', time: '7:00 AM' },
      { id: 2, title: 'Weight Training', activityType: 'Gym', location: 'Fitness First', time: '6:00 PM' },
    ];
    return Promise.resolve({ data: mockActivities });
  }
  return api.get('/activities');
};

export const joinActivity = (activityId) => {
  if (USE_MOCK) {
    return Promise.resolve({ data: { message: 'Joined activity successfully!' } });
  }
  return api.post(`/activities/${activityId}/join`);
};

export const sendMessage = (data) => {
  if (USE_MOCK) {
    return Promise.resolve({ data: { message: 'Message sent!' } });
  }
  return api.post('/chat', data);
};

export const submitRating = (data) => {
  if (USE_MOCK) {
    return Promise.resolve({ data: { message: 'Rating submitted!' } });
  }
  return api.post('/ratings', data);
};