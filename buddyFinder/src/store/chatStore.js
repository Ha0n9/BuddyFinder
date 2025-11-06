// src/stores/chatStore.js
import { create } from 'zustand';
import io from 'socket.io-client';

export const useChatStore = create((set, get) => ({
  socket: null,
  messages: {},
  unreadCount: {},

  connectSocket: (matchId) => {
    const socket = io('http://localhost:8080', {
      path: '/ws',
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
      socket.emit('join', `match-${matchId}`);
    });

    socket.on(`match-${matchId}`, (message) => {
      const currentMessages = get().messages[matchId] || [];
      set({
        messages: {
          ...get().messages,
          [matchId]: [...currentMessages, message]
        }
      });
    });

    set({ socket });
  },

  sendMessage: (matchId, content) => {
    const { socket } = get();
    if (socket) {
      socket.emit('chat', { matchId, content });
    }
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  }
}));