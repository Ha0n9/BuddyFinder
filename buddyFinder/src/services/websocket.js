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
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      console.log('🔌 Attempting WebSocket connection...');
      
      this.client = new Client({
        webSocketFactory: () => {
          const socket = new SockJS('http://localhost:8080/ws');
          console.log('🌐 SockJS socket created');
          return socket;
        },
        
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },

        debug: (str) => {
          console.log('🔍 STOMP:', str);
        },

        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: (frame) => {
          console.log('✅ WebSocket Connected!', frame);
          this.connected = true;
          this.reconnectAttempts = 0;
          resolve();
        },

        onDisconnect: () => {
          console.log('⚠️ WebSocket Disconnected');
          this.connected = false;
        },

        onStompError: (frame) => {
          console.error('❌ STOMP Error:', frame.headers['message']);
          console.error('Details:', frame.body);
          this.connected = false;
          reject(frame);
        },

        onWebSocketError: (error) => {
          console.error('❌ WebSocket Error:', error);
          this.connected = false;
        },

        onWebSocketClose: (event) => {
          console.log('🔌 WebSocket Closed:', event.reason);
          this.connected = false;
        }
      });

      this.client.activate();
    });
  }

  isConnected() {
    return this.connected && this.client?.connected;
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
    console.log(`📡 Subscribing to: ${destination}`);
    
    try {
      const subscription = this.client.subscribe(destination, (message) => {
        console.log('📨 Received message:', message.body);
        try {
          const parsedMessage = JSON.parse(message.body);
          console.log('✅ Parsed message:', parsedMessage);
          callback(parsedMessage);
        } catch (error) {
          console.error('❌ Failed to parse message:', error);
        }
      });

      this.subscriptions.set(`match-${matchId}`, subscription);
      console.log(`✅ Successfully subscribed to match ${matchId}`);
      
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
    console.log(`📡 Subscribing to notifications: ${destination}`);
    
    try {
      const subscription = this.client.subscribe(destination, (message) => {
        const notification = JSON.parse(message.body);
        console.log('🔔 Received notification:', notification);
        callback(notification);
      });

      this.subscriptions.set(`notifications-${userId}`, subscription);
      console.log(`✅ Successfully subscribed to notifications for user ${userId}`);
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

    console.log(`📤 Sending message to ${destination}:`, payload);

    try {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(payload)
      });
      console.log('✅ Message sent via WebSocket');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  unsubscribeFromMatch(matchId) {
    const key = `match-${matchId}`;
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
      console.log(`✅ Unsubscribed from match ${matchId}`);
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
      console.log(`♻️ Re-subscribing to group ${roomId}`);
    }

    const destination = `/topic/group/${roomId}`;
    console.log(`📡 Subscribing to group chat: ${destination}`);

    try {
      const subscription = this.client.subscribe(destination, (message) => {
        console.log('📨 Group message received:', message.body);

        try {
          const parsed = JSON.parse(message.body);
          console.log('✅ Parsed group message:', parsed);
          callback(parsed);
        } catch (err) {
          console.error('❌ Failed to parse group chat message:', err);
        }
      });

      this.subscriptions.set(key, subscription);
      console.log(`✅ Subscribed to group ${roomId}`);

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
      console.log(`🛑 Unsubscribed from group room ${roomId}`);
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

    console.log(`📤 Sending group message to ${destination}:`, payload);

    try {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(payload)
      });
      console.log('✅ Group message sent');
    } catch (error) {
      console.error('❌ Failed to send group message:', error);
      throw error;
    }
  }

  disconnect() {
    console.log('🔌 Disconnecting WebSocket...');
    if (this.client) {
      this.subscriptions.forEach((sub, key) => {
        console.log(`Unsubscribing from ${key}`);
        sub.unsubscribe();
      });
      this.subscriptions.clear();
      this.client.deactivate();
      this.connected = false;
      console.log('✅ WebSocket disconnected');
    }
  }
}

export default new WebSocketService();
