import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'planning' | 'abroad') => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (data.user) {
        set({ user: data.user });
        toast.success('Welcome back!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
      throw error;
    }
  },
  signUp: async (email, password, role) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        set({ user: data.user });
        toast.success('Account created successfully! Welcome to GlobalNest.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
      throw error;
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Signout error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  },
  setUser: (user) => set({ user, loading: false })
}));