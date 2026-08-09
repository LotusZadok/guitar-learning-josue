// Contrato único del banco de sonidos. Todo lo que sepa "cómo suena una nota"
// vive detrás de esta interfaz; useAudioEngine sólo sabe de frecuencias,
// duraciones y de a dónde enrutar la salida. Cambiar de banco = cambiar la
// línea de `ACTIVE_INSTRUMENT` en ./index.ts.
export interface Instrument {
  readonly id: string;
  // Precarga opcional (samples). Se llama al crear el AudioContext, no bloquea.
  preload?: (ctx: AudioContext) => Promise<void>;
  // Emite una nota. `out` ya está conectado al master gain y registrado para
  // que stopAllNotes() pueda hacerle fade; el instrumento sólo cuelga de ahí.
  playNote: (
    ctx: AudioContext,
    freq: number,
    duration: number,
    out: AudioNode,
  ) => void;
}
