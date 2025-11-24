import { create } from 'zustand';

interface User { id: string; email: string; name: string; }

interface AppState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // --- New Theme State ---
  darkMode: boolean;
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: localStorage.getItem('ohb_token'),
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

  // --- Initialize from LocalStorage ---
  darkMode: localStorage.getItem('ohb_theme') === 'dark',
  
  toggleTheme: () => set((state) => {
    const newMode = !state.darkMode;
    localStorage.setItem('ohb_theme', newMode ? 'dark' : 'light');
    // Directly toggle class on html element for instant switch
    if (newMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    return { darkMode: newMode };
  }),
}));