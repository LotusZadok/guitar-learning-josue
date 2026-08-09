import type { Instrument } from "./instrument";

// Banco sintético original (osciladores + transitorio de martillo). Se conserva
// como fallback cuando los samples no cargan y como referencia del timbre que
// tenía el método antes del banco de guitarra.
export const synthInstrument: Instrument = {
  id: "synth",

  playNote(ctx, freq, duration, out) {
    const now = ctx.currentTime;
    const env = ctx.createGain();
    env.connect(out);

    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.2, now + 0.006);
    env.gain.exponentialRampToValueAtTime(0.1, now + 0.12);
    env.gain.exponentialRampToValueAtTime(0.035, now + duration * 0.55);
    env.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const harmonics = [
      { ratio: 1, amp: 1.0, type: "triangle" as OscillatorType },
      { ratio: 2, amp: 0.45, type: "sine" as OscillatorType },
      { ratio: 3, amp: 0.15, type: "sine" as OscillatorType },
      { ratio: 4, amp: 0.06, type: "sine" as OscillatorType },
      { ratio: 0.998, amp: 0.12, type: "sine" as OscillatorType },
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
      gain.connect(env);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    });

    // Transitorio de martillo
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
    nFilt.type = "highpass";
    nFilt.frequency.setValueAtTime(3500, now);
    nSrc.connect(nFilt);
    nFilt.connect(nGain);
    nGain.connect(env);
    nSrc.start(now);
    nSrc.stop(now + noiseLen + 0.01);
  },
};
