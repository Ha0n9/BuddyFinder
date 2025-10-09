import io from 'socket.io-client';

const socket = io('http://localhost:8080', {
  auth: {
    token: localStorage.getItem('token'),
  },
});

export const joinChat = (userId) => {
  socket.emit('join', userId);
};

export const sendMessage = (message) => {
  socket.emit('message', message);
};

export const onMessage = (callback) => {
  socket.on('message', callback);
};