// src/services/websocket.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },

        debug: (str) => {
          console.log('STOMP:', str);
        },

        onConnect: () => {
          console.log('✅ WebSocket Connected');
          resolve();
        },

        onStompError: (frame) => {
          console.error('❌ STOMP Error:', frame);
          reject(frame);
        },

        onWebSocketError: (error) => {
          console.error('❌ WebSocket Error:', error);
          reject(error);
        }
      });

      this.client.activate();
    });
  }

  subscribeToMatch(matchId, callback) {
    if (!this.client?.connected) {
      console.warn('WebSocket not connected');
      return null;
    }

    const destination = `/topic/match/${matchId}`;
    
    const subscription = this.client.subscribe(destination, (message) => {
      const parsedMessage = JSON.parse(message.body);
      callback(parsedMessage);
    });

    this.subscriptions.set(matchId, subscription);
    console.log(`✅ Subscribed to match ${matchId}`);
    
    return subscription;
  }

  sendMessage(matchId, senderId, content) {
    if (!this.client?.connected) {
      console.warn('Cannot send: WebSocket not connected');
      return;
    }

    this.client.publish({
      destination: `/app/chat/${matchId}`,
      body: JSON.stringify({
        senderId,
        content
      })
    });
  }

  unsubscribeFromMatch(matchId) {
    const subscription = this.subscriptions.get(matchId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(matchId);
      console.log(`Unsubscribed from match ${matchId}`);
    }
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      console.log('WebSocket disconnected');
    }
  }
}

export default new WebSocketService();