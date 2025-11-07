import { create } from 'zustand';
import { Client } from '@stomp/stompjs';

export const useChatStore = create((set, get) => ({
  stompClient: null,
  messages: {},
  connected: false,

  connect: (matchId, userId) => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
    });

    client.onConnect = () => {
      console.log('✅ WebSocket Connected');
      set({ connected: true, stompClient: client });

      client.subscribe(`/topic/match/${matchId}`, (message) => {
        const chatMessage = JSON.parse(message.body);
        const currentMessages = get().messages[matchId] || [];
        set({
          messages: {
            ...get().messages,
            [matchId]: [...currentMessages, chatMessage]
          }
        });
      });
    };

    client.onStompError = (frame) => {
      console.error('❌ STOMP error:', frame);
    };

    client.onWebSocketClose = (evt) => {
      console.log('WebSocket closed:', evt);
    };

    client.activate();
  },

  sendMessage: (matchId, senderId, content) => {
    const { stompClient } = get();
    if (stompClient?.connected) {
      stompClient.publish({
        destination: `/app/chat/${matchId}`,
        body: JSON.stringify({ senderId, content })
      });
    }
  },

  disconnect: () => {
    const { stompClient } = get();
    if (stompClient) {
      stompClient.deactivate();
      set({ connected: false, stompClient: null });
    }
  },

  setMessages: (matchId, messages) => {
    set({
      messages: {
        ...get().messages,
        [matchId]: messages
      }
    });
  }
}));