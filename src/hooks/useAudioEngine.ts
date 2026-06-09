import { useCallback, useRef } from 'react';
import { NOTE_FREQS } from '../data/notes';
import { useUIStore } from '../stores/useUIStore';

let audioCtx: AudioContext | null = null;
let masterVolumeNode: GainNode | null = null;

// Octava de referencia que asumen los consumidores al escribir sus alturas.
// El selector global de octava desplaza todo respecto a esta base.
const REFERENCE_OCTAVE = 4;

// Reunión 24/5/26: poder cortar el sonido del acorde anterior cuando arranca el siguiente.
// Tracking global de gains activos; cualquier consumidor puede llamar stopAllNotes() para cortar.
const activeGains = new Set<GainNode>();
export function stopAllNotes(fadeMs = 80) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const fadeSec = fadeMs / 1000;
  activeGains.forEach((g) => {
    try {
      g.gain.cancelScheduledValues(t);
      const v = Math.max(g.gain.value, 0.0001);
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + fadeSec);
    } catch { /* ignored */ }
  });
  activeGains.clear();
}

const getCtx = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterVolumeNode = audioCtx.createGain();
    masterVolumeNode.gain.value = useUIStore.getState().volume;
    masterVolumeNode.connect(audioCtx.destination);
  }
  audioCtx.resume();
  return audioCtx;
};

// Update master volume in real time. Called from Sidebar volume slider.
export const setMasterVolume = (v: number) => {
  if (masterVolumeNode) masterVolumeNode.gain.value = v;
};

export const useAudioEngine = () => {
  const lastPlayedRef = useRef<string | null>(null);

  const playNote = useCallback((noteName: string, octave: number, duration = 2.0) => {
    if (useUIStore.getState().audioMuted) return;
    const ctx = getCtx();
    let key = noteName.replace('♯', '#').replace('♭', 'b');
    const flatMap: Record<string, string> = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
    for (const [f, s] of Object.entries(flatMap)) {
      if (key.startsWith(f)) { key = s + key.slice(2); break; }
    }
    // Transpone global: la octava elegida en el selector es el registro base
    // de TODOS los ejemplos. Los consumidores escriben sus octavas asumiendo
    // base 4 (C4); aquí se desplaza todo al registro elegido (default C3 → −1).
    const effectiveOctave = octave + (useUIStore.getState().octave - REFERENCE_OCTAVE);
    key = key + effectiveOctave;
    const freq = NOTE_FREQS[key];
    if (!freq) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.connect(masterVolumeNode ?? ctx.destination);
    activeGains.add(masterGain);
    setTimeout(() => activeGains.delete(masterGain), (duration + 0.1) * 1000);

    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.20, now + 0.006);
    masterGain.gain.exponentialRampToValueAtTime(0.10, now + 0.12);
    masterGain.gain.exponentialRampToValueAtTime(0.035, now + duration * 0.55);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const harmonics = [
      { ratio: 1, amp: 1.0, type: 'triangle' as OscillatorType },
      { ratio: 2, amp: 0.45, type: 'sine' as OscillatorType },
      { ratio: 3, amp: 0.15, type: 'sine' as OscillatorType },
      { ratio: 4, amp: 0.06, type: 'sine' as OscillatorType },
      { ratio: 0.998, amp: 0.12, type: 'sine' as OscillatorType },
    ];

    harmonics.forEach((h) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = h.type;
      osc.frequency.setValueAtTime(freq * h.ratio, now);
      gain.gain.setValueAtTime(h.amp, now);
      if (h.ratio > 2) {
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.35);
      }
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    });

    // Hammer transient
    const noiseLen = 0.018;
    const bufSize = ctx.sampleRate * noiseLen;
    const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) nd[i] = (Math.random() * 2 - 1) * 0.25;
    const nSrc = ctx.createBufferSource();
    nSrc.buffer = noiseBuf;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.05, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + noiseLen);
    const nFilt = ctx.createBiquadFilter();
    nFilt.type = 'highpass';
    nFilt.frequency.setValueAtTime(3500, now);
    nSrc.connect(nFilt);
    nFilt.connect(nGain);
    nGain.connect(masterGain);
    nSrc.start(now);
    nSrc.stop(now + noiseLen + 0.01);
  }, []);

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
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.connect(gain);
    gain.connect(masterVolumeNode ?? ctx.destination);
    osc.start(time);
    osc.stop(time + 0.12);
  }, []);

  const playRhythm = useCallback((count: number, totalBeats: number, bpm = 100) => {
    if (useUIStore.getState().audioMuted) return;
    const ctx = getCtx();
    const beatDur = 60 / bpm;
    const totalDur = beatDur * totalBeats;
    const interval = totalDur / count;
    const now = ctx.currentTime;
    for (let i = 0; i < count; i++) {
      playClick(i === 0 ? 880 : 660, now + i * interval);
    }
  }, [playClick]);

  const playNoteIfNew = useCallback(
    (noteName: string, octave: number, stringIndex: number, fret: number) => {
      const key = `${noteName}${octave}${stringIndex}${fret}`;
      if (lastPlayedRef.current !== key) {
        lastPlayedRef.current = key;
        playNote(noteName, octave);
      }
    },
    [playNote]
  );

  const resetLastPlayed = useCallback(() => {
    lastPlayedRef.current = null;
  }, []);

  return { playNote, playSequence, playClick, playRhythm, playNoteIfNew, resetLastPlayed };
};
