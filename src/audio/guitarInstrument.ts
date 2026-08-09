import { Note } from "tonal";
import type { Instrument } from "./instrument";
import { synthInstrument } from "./synthInstrument";

// Banco de guitarra nylon: samples reales (FluidR3_GM, CC-BY 3.0) servidos
// desde /samples/guitar-nylon. Ver public/samples/guitar-nylon/LICENSE.txt.
//
// Se muestrea cada 3 semitonos (C, Eb, Gb, A) de C1 a C6: 21 archivos, ~364 KB.
// Las notas intermedias se obtienen resampleando el vecino más cercano, nunca
// más de un semitono — inaudible como "chipmunk" y evita bajar 88 archivos.
const SAMPLE_NOTES = [
  "C1", "Eb1", "Gb1", "A1",
  "C2", "Eb2", "Gb2", "A2",
  "C3", "Eb3", "Gb3", "A3",
  "C4", "Eb4", "Gb4", "A4",
  "C5", "Eb5", "Gb5", "A5",
  "C6",
];

const BASE_URL = `${import.meta.env.BASE_URL}samples/guitar-nylon`;

// La guitarra ya trae su propio ataque y decaimiento en el sample; el envelope
// sólo iguala el nivel con el banco sintético y corta la cola en `duration`.
// 1.7 iguala el RMS del banco sintético medido sobre una nota de 2 s (A3):
// synth RMS 0.0333 / guitarra RMS 0.0195. Los samples vienen normalizados
// (pico ~0.12 en todo el rango), así que un único factor sirve para todos.
const PEAK_GAIN = 1.7;
const RELEASE = 0.18;

interface Sample {
  freq: number;
  buffer: AudioBuffer;
}

let samples: Sample[] | null = null;
let loading: Promise<void> | null = null;
let failed = false;

async function loadSample(ctx: AudioContext, note: string): Promise<Sample> {
  const res = await fetch(`${BASE_URL}/${note}.mp3`);
  if (!res.ok) throw new Error(`sample ${note}: ${res.status}`);
  const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
  return { freq: Note.freq(note)!, buffer };
}

function preload(ctx: AudioContext): Promise<void> {
  if (!loading) {
    loading = Promise.all(SAMPLE_NOTES.map((n) => loadSample(ctx, n)))
      .then((loaded) => {
        samples = loaded.sort((a, b) => a.freq - b.freq);
      })
      .catch((err) => {
        // Sin samples el método sigue sonando: se cae al banco sintético.
        failed = true;
        console.warn("[audio] banco de guitarra no disponible", err);
      });
  }
  return loading;
}

function nearest(freq: number): Sample {
  return samples!.reduce((best, s) =>
    Math.abs(Math.log2(s.freq / freq)) < Math.abs(Math.log2(best.freq / freq))
      ? s
      : best,
  );
}

function emit(ctx: AudioContext, freq: number, duration: number, out: AudioNode) {
  const sample = nearest(freq);
  const now = ctx.currentTime;

  const src = ctx.createBufferSource();
  src.buffer = sample.buffer;
  src.playbackRate.value = freq / sample.freq;

  const env = ctx.createGain();
  env.gain.setValueAtTime(PEAK_GAIN, now);
  const release = Math.min(RELEASE, duration * 0.5);
  env.gain.setValueAtTime(PEAK_GAIN, now + duration - release);
  env.gain.exponentialRampToValueAtTime(0.001, now + duration);

  src.connect(env);
  env.connect(out);
  src.start(now);
  src.stop(now + duration + 0.05);
}

export const guitarInstrument: Instrument = {
  id: "guitar-nylon",
  preload,

  playNote(ctx, freq, duration, out) {
    if (failed) {
      synthInstrument.playNote(ctx, freq, duration, out);
      return;
    }
    if (samples) {
      emit(ctx, freq, duration, out);
      return;
    }
    // Primer clic antes de que terminen de bajar los samples: se emite en
    // cuanto estén, sin perder la nota. Ocurre una vez por sesión.
    void preload(ctx).then(() => {
      if (samples) emit(ctx, freq, duration, out);
      else synthInstrument.playNote(ctx, freq, duration, out);
    });
  },
};
