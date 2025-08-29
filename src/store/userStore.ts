import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CreateUserRequest } from '../types/entities';
import { userService } from '../services/UserService';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createUser: (userData: CreateUserRequest) => Promise<User>;
  loadUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
  upsertUser: (userData: CreateUserRequest) => Promise<User>;
  clearUser: () => void;
  
  // Computed
  isLoggedIn: () => boolean;
  getUserAddress: () => User['address'] | null;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      createUser: async (userData: CreateUserRequest) => {
        set({ isLoading: true, error: null });
        try {
          const user = await userService.createUser(userData);
          set({ user, isLoading: false });
          return user;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      loadUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await userService.getUser(userId);
          set({ user, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load user';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updateUser: async (userId: string, userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await userService.updateUser(userId, userData);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      upsertUser: async (userData: CreateUserRequest) => {
        set({ isLoading: true, error: null });
        try {
          const user = await userService.upsertUser(userData);
          set({ user, isLoading: false });
          return user;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to save user';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      clearUser: () => {
        set({ user: null, error: null });
      },

      // Computed properties
      isLoggedIn: () => {
        const { user } = get();
        return user !== null;
      },

      getUserAddress: () => {
        const { user } = get();
        return user?.address || null;
      },
    }),
    {
      name: 'cyoda-user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);