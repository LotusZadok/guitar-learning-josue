import { useCallback, useRef } from 'react';
import { NOTE_FREQS } from '../data/notes';

let audioCtx: AudioContext | null = null;
const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  audioCtx.resume();
  return audioCtx;
};

export const useAudioEngine = () => {
  const lastPlayedRef = useRef<string | null>(null);

  const playNote = useCallback((noteName: string, octave: number, duration = 2.0) => {
    const ctx = getCtx();
    let key = noteName.replace('♯', '#').replace('♭', 'b');
    const flatMap: Record<string, string> = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
    for (const [f, s] of Object.entries(flatMap)) {
      if (key.startsWith(f)) { key = s + key.slice(2); break; }
    }
    key = key + octave;
    const freq = NOTE_FREQS[key];
    if (!freq) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);

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

  const playClick = useCallback((freq: number, time: number) => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.12);
  }, []);

  const playRhythm = useCallback((count: number, totalBeats: number, bpm = 100) => {
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

  return { playNote, playClick, playRhythm, playNoteIfNew, resetLastPlayed };
};
