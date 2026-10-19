import { useCallback } from "react";
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

// Exportada (no solo de uso interno): el reloj del constructor de progresiones
// (useProgressionPlayback) necesita un AudioContext para leer currentTime aun
// con el audio muteado -- el cabezal visual no puede depender de que suene
// nada. playNote/playClick cortan camino ANTES de llamar a esto cuando
// audioMuted es true, así que sin este export el primer Play con audio
// muteado (el estado por defecto) no crea contexto y no pasa nada.
export const getCtx = (): AudioContext => {
  let ctx = getAudioContext();
  // Un contexto cerrado no se puede reanudar: se crea otro. Los AudioBuffer
  // del banco de guitarra sirven en cualquier contexto, no hay que recargarlos.
  if (!ctx || ctx.state === "closed") ctx = createAudioContext();
  resumeAudioContext(ctx);
  return ctx;
};

function createAudioContext(): AudioContext {
  enablePlaybackAudioSession();
  const ctx = new AudioContext();
  setAudioContext(ctx);
  const gainNode = ctx.createGain();
  gainNode.gain.value = useUIStore.getState().volume;
  gainNode.connect(ctx.destination);
  setMasterVolumeNode(gainNode);
  void instrument.preload?.(ctx);
  resumeAudioContextOnReturn();
  return ctx;
}

// Reunión 19/10/26: "vuelvo aquí a la página y ya no suena". Al cambiar de
// pestaña, bloquear la pantalla o recibir una llamada (iOS: estado
// "interrupted"), el navegador suspende el contexto y nada lo reanudaba.
function resumeAudioContext(ctx: AudioContext) {
  if (ctx.state === "running") return;
  ctx.resume().catch((err) => {
    console.warn("[audio] no se pudo reanudar el AudioContext", err);
  });
}

let resumeOnReturnRegistered = false;

function resumeAudioContextOnReturn() {
  if (resumeOnReturnRegistered) return;
  resumeOnReturnRegistered = true;
  const resumeIfVisible = () => {
    const ctx = getAudioContext();
    if (document.visibilityState === "visible" && ctx && ctx.state !== "closed") {
      resumeAudioContext(ctx);
    }
  };
  document.addEventListener("visibilitychange", resumeIfVisible);
  window.addEventListener("pageshow", resumeIfVisible);
}

// Safari iOS (16.4+): con el tipo "playback" el audio suena aunque el
// interruptor físico de silencio esté activado. Sin él, Web Audio lo respeta
// y "pongo el sonido y no sonó" en el celular.
function enablePlaybackAudioSession() {
  const session = (navigator as Navigator & { audioSession?: { type: string } })
    .audioSession;
  if (session) session.type = "playback";
}

// Update master volume in real time. Called from Sidebar volume slider.
export const setMasterVolume = (v: number) => {
  const masterVolume = getMasterVolumeNode();
  if (masterVolume) masterVolume.gain.value = v;
};

export { stopAllNotes };

export const useAudioEngine = () => {
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

  return { playNote, playSequence, playClick };
};
