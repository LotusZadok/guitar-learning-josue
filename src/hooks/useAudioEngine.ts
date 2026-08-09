import { useCallback, useRef } from "react";
import { Note } from "tonal";
import { useUIStore } from "../stores/useUIStore";
import { instrument } from "../audio";
import {
  getMasterVolumeNode,
  getAudioContext,
  registerActiveGain,
  setAudioContext,
  setMasterVolumeNode,
  stopAllNotes,
  unregisterActiveGain,
} from "./audioEngineShared";

// Octava de referencia que asumen los consumidores al escribir sus alturas.
// El selector global de octava desplaza todo respecto a esta base.
const REFERENCE_OCTAVE = 4;

const getCtx = (): AudioContext => {
  let ctx = getAudioContext();
  if (!ctx) {
    ctx = new AudioContext();
    setAudioContext(ctx);
    const gainNode = ctx.createGain();
    gainNode.gain.value = useUIStore.getState().volume;
    gainNode.connect(ctx.destination);
    setMasterVolumeNode(gainNode);
    void instrument.preload?.(ctx);
  }
  ctx.resume();
  return ctx;
};

// Update master volume in real time. Called from Sidebar volume slider.
export const setMasterVolume = (v: number) => {
  const masterVolume = getMasterVolumeNode();
  if (masterVolume) masterVolume.gain.value = v;
};

export { stopAllNotes };

export const useAudioEngine = () => {
  const lastPlayedRef = useRef<string | null>(null);

  const playNote = useCallback(
    (noteName: string, octave: number, duration = 2.0) => {
      if (useUIStore.getState().audioMuted) return;
      const ctx = getCtx();
      const ascii = noteName.replace(/♯/g, "#").replace(/♭/g, "b");
      // Transpone global: la octava elegida en el selector es el registro base
      // de TODOS los ejemplos. Los consumidores escriben sus octavas asumiendo
      // base 4 (C4); aquí se desplaza todo al registro elegido (default C3 → −1).
      const effectiveOctave =
        octave + (useUIStore.getState().octave - REFERENCE_OCTAVE);
      const freq = Note.freq(`${ascii}${effectiveOctave}`);
      if (!freq) return;

      // Nodo por voz: es lo que stopAllNotes() atenúa. El timbre lo pone el
      // banco activo (ver src/audio), que cuelga su envelope debajo de aquí.
      const voice = ctx.createGain();
      voice.connect(getMasterVolumeNode() ?? ctx.destination);
      registerActiveGain(voice);
      setTimeout(() => unregisterActiveGain(voice), (duration + 0.1) * 1000);

      instrument.playNote(ctx, freq, duration, voice);
    },
    [],
  );

  // Reunión 6/7/26: secuencias melódicas (escala, resolución, regla de la 5ª,
  // cadena de terceras) no deben acumular voces. Cada nota dura ~ el espacio
  // hasta la siguiente más una cola muy corta → se cortan antes o "apenas se
  // tocan" (traslape mínimo), sin ensuciar. Acordes/arpegios NO usan esto:
  // ahí el traslape es deliberado para oír el acorde.
  const playSequence = useCallback(
    (notes: { name: string; octave: number }[], gapMs = 320, tailMs = 150) => {
      const dur = (gapMs + tailMs) / 1000;
      notes.forEach((n, i) => {
        setTimeout(() => playNote(n.name, n.octave, dur), i * gapMs);
      });
    },
    [playNote],
  );

  const playClick = useCallback((freq: number, time: number) => {
    if (useUIStore.getState().audioMuted) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.connect(gain);
    gain.connect(getMasterVolumeNode() ?? ctx.destination);
    osc.start(time);
    osc.stop(time + 0.12);
  }, []);

  const playRhythm = useCallback(
    (count: number, totalBeats: number, bpm = 100) => {
      if (useUIStore.getState().audioMuted) return;
      const ctx = getCtx();
      const beatDur = 60 / bpm;
      const totalDur = beatDur * totalBeats;
      const interval = totalDur / count;
      const now = ctx.currentTime;
      for (let i = 0; i < count; i++) {
        playClick(i === 0 ? 880 : 660, now + i * interval);
      }
    },
    [playClick],
  );

  const playNoteIfNew = useCallback(
    (noteName: string, octave: number, stringIndex: number, fret: number) => {
      const key = `${noteName}${octave}${stringIndex}${fret}`;
      if (lastPlayedRef.current !== key) {
        lastPlayedRef.current = key;
        playNote(noteName, octave);
      }
    },
    [playNote],
  );

  const resetLastPlayed = useCallback(() => {
    lastPlayedRef.current = null;
  }, []);

  return {
    playNote,
    playSequence,
    playClick,
    playRhythm,
    playNoteIfNew,
    resetLastPlayed,
  };
};
