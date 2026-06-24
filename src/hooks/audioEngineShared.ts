let audioCtx: AudioContext | null = null;
let masterVolumeNode: GainNode | null = null;
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
    } catch {
      /* ignored */
    }
  });
  activeGains.clear();
}

export function registerActiveGain(gain: GainNode) {
  activeGains.add(gain);
}

export function unregisterActiveGain(gain: GainNode) {
  activeGains.delete(gain);
}

export function setMasterVolumeNode(node: GainNode) {
  masterVolumeNode = node;
}

export function getMasterVolumeNode() {
  return masterVolumeNode;
}

export function getAudioContext() {
  return audioCtx;
}

export function setAudioContext(ctx: AudioContext) {
  audioCtx = ctx;
}
