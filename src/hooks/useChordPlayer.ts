import { useCallback, useEffect, useRef } from 'react';
import { useAudioEngine } from './useAudioEngine';
import type { ChromaticNote } from '../types/music';

export interface ChordNote {
  chromatic: ChromaticNote;
  octave: number;
}

// El scheduler de acordes que las secciones con bloque/arpegio compartían
// copiado a mano: el array de timers, el clear, y el "suena cada nota del
// acorde separada por un gap". Lo que NO vive acá es el estado visual (qué
// tarjeta/celda/fila está sonando): cada consumidor lo modela distinto
// (booleano, índice, modo) y unificarlo sería generalizar de más.
//
// `gap = 0` es bloque (todas las notas juntas); `gap > 0` es arpegio.
//
// El cleanup de desmontaje es la razón de peso para tener el hook: de los
// consumidores que hacían esto a mano, sólo uno cancelaba sus timers al
// desmontar. En el resto, navegar fuera de la sección con un acorde sonando
// dejaba setTimeouts vivos que llamaban playNote sobre un componente ya
// desmontado. Acá se cancela una vez, para todos.
export function useChordPlayer(noteDuration: number) {
  const { playNote } = useAudioEngine();
  const timers = useRef<number[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const at = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const playChord = useCallback(
    (notes: readonly ChordNote[], gap: number, delay = 0) => {
      notes.forEach((n, i) =>
        at(() => playNote(n.chromatic, n.octave, noteDuration), delay + i * gap),
      );
    },
    [at, playNote, noteDuration],
  );

  useEffect(() => clear, [clear]);

  return { playChord, at, clear };
}
