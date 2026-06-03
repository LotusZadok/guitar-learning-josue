import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode, Tonic } from '../types/music';

interface UIState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  activeSection: string;
  audioMuted: boolean;
  volume: number;
  tonic: Tonic;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveSection: (section: string) => void;
  toggleAudioMute: () => void;
  setAudioMuted: (muted: boolean) => void;
  setVolume: (v: number) => void;
  setTonic: (t: Tonic) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: false,
      activeSection: 'cuerdas',
      audioMuted: true,
      volume: 0.8,
      tonic: 'C',

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveSection: (section) => set({ activeSection: section }),
      toggleAudioMute: () => set((s) => ({ audioMuted: !s.audioMuted })),
      setAudioMuted: (muted) => set({ audioMuted: muted }),
      setVolume: (v) => set({ volume: v }),
      setTonic: (t) => set({ tonic: t }),
    }),
    { name: 'apuntes-ui', partialize: (state) => ({ theme: state.theme }) }
  )
);
