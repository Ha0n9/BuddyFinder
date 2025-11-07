// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user 
      }),
    }
  )
);