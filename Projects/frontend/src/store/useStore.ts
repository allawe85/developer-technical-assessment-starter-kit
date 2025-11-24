import { create } from 'zustand';

interface User { id: string; email: string; name: string; }

interface AppState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: localStorage.getItem('ohb_token'), // Restore token on reload
  login: (user, token) => {
    localStorage.setItem('ohb_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('ohb_token');
    set({ user: null, token: null });
  },
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));