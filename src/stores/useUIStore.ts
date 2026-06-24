import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode, Tonic } from "../types/music";
import { stopAllNotes } from "../hooks/audioEngineShared";

interface UIState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  activeSection: string;
  audioMuted: boolean;
  volume: number;
  tonic: Tonic;
  octave: number;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveSection: (section: string) => void;
  toggleAudioMute: () => void;
  setAudioMuted: (muted: boolean) => void;
  setVolume: (v: number) => void;
  setTonic: (t: Tonic) => void;
  setOctave: (o: number) => void;
}

// Registro base global del sonido. La octava elegida es la altura de la nota
// más grave (la tónica); todo ejemplo orbita ascendiendo desde ahí. Rango de
// 4 octavas centrado en C3 (decisión del método: default C3, grave↔agudo ±2).
export const OCTAVE_MIN = 1;
export const OCTAVE_MAX = 5;
export const OCTAVE_DEFAULT = 3;

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "dark",
      sidebarOpen: false,
      activeSection: "cuerdas",
      audioMuted: true,
      volume: 0.8,
      tonic: "C",
      octave: OCTAVE_DEFAULT,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveSection: (section) => set({ activeSection: section }),
      toggleAudioMute: () => set((s) => ({ audioMuted: !s.audioMuted })),
      setAudioMuted: (muted) => set({ audioMuted: muted }),
      setVolume: (v) => set({ volume: v }),
      setTonic: (t) => {
        stopAllNotes();
        set({ tonic: t });
      },
      setOctave: (o) =>
        set({ octave: Math.min(OCTAVE_MAX, Math.max(OCTAVE_MIN, o)) }),
    }),
    { name: "apuntes-ui", partialize: (state) => ({ theme: state.theme }) },
  ),
);
