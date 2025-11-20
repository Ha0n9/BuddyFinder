// src/store/notificationStore.js
import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  setNotifications: (notifications) => {
    const unread = notifications.filter(n => !n.isRead).length;
    set({ notifications, unreadCount: unread });
  },

  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  markAsRead: (notiId) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.notiId === notiId ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0
    }));
  },

  removeNotification: (notiId) => {
    set(state => {
      const notification = state.notifications.find(n => n.notiId === notiId);
      const wasUnread = notification && !notification.isRead;
      return {
        notifications: state.notifications.filter(n => n.notiId !== notiId),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
      };
    });
  },

  resetNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  }
}));
