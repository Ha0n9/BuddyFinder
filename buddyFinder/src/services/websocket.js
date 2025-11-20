// src/services/websocket.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.connectionPromise = null;
  }

  connect(token) {
    if (this.client && this.client.connected && this.connected) {
      return Promise.resolve();
    }
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      if (this.client && this.client.active) {
        try {
          this.client.deactivate();
        } catch (e) {
          console.warn('Failed to deactivate stale WebSocket client', e);
        }
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },

        debug: () => {},

        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
          this.connected = true;
          this.reconnectAttempts = 0;
          this.connectionPromise = null;
          resolve();
        },

        onDisconnect: () => {
          this.connected = false;
          this.connectionPromise = null;
        },

        onStompError: (frame) => {
          console.error('❌ STOMP Error:', frame.headers['message']);
          console.error('Details:', frame.body);
          this.connected = false;
          this.connectionPromise = null;
          reject(frame);
        },

        onWebSocketError: (error) => {
          console.error('❌ WebSocket Error:', error);
          this.connected = false;
        },

        onWebSocketClose: () => {
          this.connected = false;
          this.connectionPromise = null;
        }
      });

      this.client.activate();
    });

    return this.connectionPromise;
  }

  isConnected() {
    return this.connected;
  }

  /**
   * Subscribe to match chat
   */
  subscribeToMatch(matchId, callback) {
    if (!this.isConnected()) {
      console.warn('⚠️ Cannot subscribe: WebSocket not connected');
      return null;
    }

    // Unsubscribe existing subscription if any
    this.unsubscribeFromMatch(matchId);

    const destination = `/topic/match/${matchId}`;
    
    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          callback(parsedMessage);
        } catch (error) {
          console.error('❌ Failed to parse message:', error);
        }
      });

      this.subscriptions.set(`match-${matchId}`, subscription);
      
      return subscription;
    } catch (error) {
      console.error('❌ Failed to subscribe:', error);
      return null;
    }
  }

  /**
   * Subscribe to notifications
   */
  subscribeToNotifications(userId, callback) {
    if (!this.isConnected()) {
      console.warn('⚠️ Cannot subscribe to notifications: WebSocket not connected');
      return null;
    }

    const destination = `/topic/notifications/${userId}`;
    
    try {
      const subscription = this.client.subscribe(destination, (message) => {
        const notification = JSON.parse(message.body);
        callback(notification);
      });

      this.subscriptions.set(`notifications-${userId}`, subscription);
      return subscription;
    } catch (error) {
      console.error('❌ Failed to subscribe to notifications:', error);
      return null;
    }
  }

  /**
   * Send message via WebSocket (1-1 chat)
   */
  sendMessage(matchId, senderId, content) {
    if (!this.isConnected()) {
      console.error('❌ Cannot send: WebSocket not connected');
      throw new Error('WebSocket not connected');
    }

    const destination = `/app/chat/${matchId}`;
    const payload = {
      senderId,
      content
    };

    try {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  sendTyping(matchId, senderId, typing) {
    if (!this.isConnected()) {
      return;
    }

    const destination = `/app/chat/${matchId}/typing`;
    const payload = { senderId, typing };

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('❌ Failed to send typing event:', error);
    }
  }

  unsubscribeFromMatch(matchId) {
    const key = `match-${matchId}`;
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  /**
   * Subscribe to group chat (activity room)
   */
  subscribeToGroup(roomId, callback) {
    if (!this.isConnected()) {
      console.warn('⚠️ Cannot subscribe: WebSocket not connected');
      return null;
    }

    const key = `group-${roomId}`;

    // Unsubscribe existing subscription if any
    const existing = this.subscriptions.get(key);
    if (existing) {
      existing.unsubscribe();
      this.subscriptions.delete(key);
    }

    const destination = `/topic/group/${roomId}`;

    try {
      const subscription = this.client.subscribe(destination, (message) => {

        try {
          const parsed = JSON.parse(message.body);
          callback(parsed);
        } catch (err) {
          console.error('❌ Failed to parse group chat message:', err);
        }
      });

      this.subscriptions.set(key, subscription);

      return subscription;
    } catch (err) {
      console.error('❌ Failed to subscribe to group:', err);
      return null;
    }
  }

  /**
   * Unsubscribe from a group chat room
   */
  unsubscribeFromGroup(roomId) {
    const key = `group-${roomId}`;
    const subscription = this.subscriptions.get(key);

    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  /**
   * Send message to group chat via WebSocket
   */
  sendGroupMessage(roomId, senderId, content) {
    if (!this.isConnected()) {
      console.error('❌ Cannot send group message: WebSocket not connected');
      throw new Error('WebSocket not connected');
    }

    const destination = `/app/group/${roomId}`;
    const payload = { senderId, content };

    try {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('❌ Failed to send group message:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach((sub, key) => {
        sub.unsubscribe();
      });
      this.subscriptions.clear();
      this.client.deactivate();
      this.connected = false;
    }
  }

  unsubscribeFromTyping(matchId) {
    const key = `typing-${matchId}`;
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  subscribeToTyping(matchId, callback) {
    if (!this.isConnected()) {
      console.warn('⚠️ Cannot subscribe: WebSocket not connected');
      return null;
    }

    const key = `typing-${matchId}`;
    const existing = this.subscriptions.get(key);
    if (existing) {
      existing.unsubscribe();
      this.subscriptions.delete(key);
    }

    const destination = `/topic/match/${matchId}/typing`;

    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const parsed = JSON.parse(message.body);
          callback(parsed);
        } catch (error) {
          console.error('❌ Failed to parse typing event:', error);
        }
      });

      this.subscriptions.set(key, subscription);
      return subscription;
    } catch (error) {
      console.error('❌ Failed to subscribe to typing events:', error);
      return null;
    }
  }
}

export default new WebSocketService();
