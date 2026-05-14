import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode, ChromaticNote } from '../types/music';

interface UIState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  activeSection: string;
  audioMuted: boolean;
  tonic: ChromaticNote;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveSection: (section: string) => void;
  toggleAudioMute: () => void;
  setAudioMuted: (muted: boolean) => void;
  setTonic: (t: ChromaticNote) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: false,
      activeSection: 'cuerdas',
      audioMuted: true,
      tonic: 'C',

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveSection: (section) => set({ activeSection: section }),
      toggleAudioMute: () => set((s) => ({ audioMuted: !s.audioMuted })),
      setAudioMuted: (muted) => set({ audioMuted: muted }),
      setTonic: (t) => set({ tonic: t }),
    }),
    { name: 'apuntes-ui', partialize: (state) => ({ theme: state.theme }) }
  )
);
