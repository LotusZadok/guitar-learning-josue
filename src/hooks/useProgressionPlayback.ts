import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudioEngine, stopAllNotes, getCtx } from './useAudioEngine';
import { getAudioContext } from './audioEngineShared';
import { acordeDeGrado, type Armadura } from '../utils/progresionAcordes';
import {
  ACENTOS,
  CASILLAS_POR_COMPAS,
  casillaEn,
  duracionTotalMs,
  gridToEvents,
  msPorCasilla,
  type Compas,
  type Grid,
  type Modo,
} from '../utils/progresionArmonica';

interface Opciones {
  grid: Grid;
  compas: Compas;
  bpm: number;
  armadura: Armadura;
  modo: Modo;
  septimas: boolean;
  metronomo: boolean;
  loop: boolean;
}

// El único dueño del reloj. La progresión es corta y acotada (máx. 8 compases ×
// 6 casillas = 48 eventos), así que se agenda entera de una vez: no hace falta
// un scheduler con lookahead.
//
// El corte de un acorde por el siguiente sale GRATIS de la duración: cada voz se
// pide con la duración exacta hasta el acorde que la reemplaza, y se extingue
// sola. No hay que apagar nada.
export function useProgressionPlayback(op: Opciones) {
  const { playNote, playClick } = useAudioEngine();
  const [reproduciendo, setReproduciendo] = useState(false);
  const [sonando, setSonando] = useState(-1);

  const timers = useRef<number[]>([]);
  const raf = useRef<number | null>(null);
  const t0 = useRef(0);

  const cancelar = useCallback(() => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  const stop = useCallback(() => {
    cancelar();
    // Global a propósito: un solo motor de audio para toda la app, sin
    // seguimiento de voces por sección. Detener acá apaga cualquier otro
    // sonido en curso, pero no hay ningún caso hoy donde el constructor
    // conviva con otra fuente de audio sonando a la vez.
    stopAllNotes();
    setReproduciendo(false);
    setSonando(-1);
  }, [cancelar]);

  const play = useCallback(() => {
    // getCtx() (no getAudioContext()) a propósito: crea/reanuda el
    // AudioContext aunque el audio esté muteado (el estado por defecto de la
    // app). El reloj del cabezal visual no puede depender de que playNote
    // decida sonar -- con audioMuted=true, playNote/playClick cortan camino
    // ANTES de tocar el contexto, así que sin esto el primer Play no hacía
    // nada. La creación/resume ocurre acá, dentro del handler de click, que
    // es el gesto de usuario que los navegadores exigen.
    const ctx = getCtx();

    cancelar();
    const eventos = gridToEvents(op.grid, op.compas, op.bpm);
    if (eventos.length === 0) return;

    const totalMs = duracionTotalMs(op.grid, op.compas, op.bpm);
    t0.current = ctx.currentTime;
    setReproduciendo(true);

    // Acordes: cada voz con su duración exacta.
    eventos.forEach((ev) => {
      const acorde = acordeDeGrado(op.armadura, op.modo, ev.degree, op.septimas);
      const id = window.setTimeout(() => {
        acorde.notas.forEach((n) => playNote(n.chromatic, n.octave, ev.durMs / 1000));
      }, ev.startMs);
      timers.current.push(id);
    });

    // Metrónomo: acento en el 1, y también en el 4 cuando el compás es 6/8,
    // que es donde el agrupamiento 3+3 se vuelve audible.
    if (op.metronomo) {
      const paso = msPorCasilla(op.compas, op.bpm);
      const porCompas = CASILLAS_POR_COMPAS[op.compas];
      const acentos = ACENTOS[op.compas];
      for (let i = 0; i < op.grid.length; i++) {
        const enCompas = i % porCompas;
        const esAcento = acentos.includes(enCompas);
        const id = window.setTimeout(() => {
          const ctxAhora = getAudioContext();
          if (ctxAhora) playClick(esAcento ? 880 : 660, ctxAhora.currentTime);
        }, i * paso);
        timers.current.push(id);
      }
    }

    // Cabezal visual: lee el reloj de audio, no un setTimeout paralelo. Un solo
    // reloj → cero deriva entre lo que se oye y lo que se ve. Funciona igual
    // con el audio muteado: el contexto ya existe (ver getCtx() arriba), y
    // currentTime avanza sin importar si algo suena.
    const tick = () => {
      const ctxAhora = getAudioContext();
      if (!ctxAhora) return;
      const ms = (ctxAhora.currentTime - t0.current) * 1000;
      setSonando(casillaEn(ms, op.compas, op.bpm, op.grid.length));
      if (ms < totalMs) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const fin = window.setTimeout(() => {
      if (op.loop) play();
      else stop();
    }, totalMs);
    timers.current.push(fin);
  }, [op, cancelar, stop, playNote, playClick]);

  // Deps intencionalmente NO son [op]: `op` es un objeto literal armado en
  // cada render de la sección, así que cambia de identidad aunque nada haya
  // cambiado. Se depende de los campos que realmente vienen del store
  // (grid, compas, bpm, armadura, modo, septimas), que sí son estables por
  // referencia entre renders cuando su valor no cambió (grid es el mismo
  // array hasta que una acción del store lo reemplaza; armadura es el mismo
  // objeto de ARMADURAS hasta que cambia armaduraId). Así el efecto solo
  // corta la reproducción cuando la progresión o el tempo cambian de verdad,
  // no en cada re-render de la sección.
  //
  // `reproduciendo` y `stop` no están en las deps porque no deben disparar
  // el efecto por sí solos: lo que importa es "¿cambió la progresión?", y
  // cuando el efecto SÍ corre, lee el `reproduciendo` y el `stop` más
  // recientes por clausura (React siempre ejecuta la versión más nueva del
  // callback), así que no hay closure vieja.
  // eslint no cubre TypeScript en este repo (ver CLAUDE.md), así que esto no
  // se puede delegar a react-hooks/exhaustive-deps: es una decisión explícita.
  useEffect(() => {
    if (reproduciendo) stop();
  }, [op.grid, op.compas, op.bpm, op.armadura, op.modo, op.septimas]);

  // Cleanup de desmontaje. `stop` es estable (depende solo de `cancelar`,
  // que no tiene deps), así que este efecto monta una vez y su cleanup corre
  // una vez, al desmontar -- no se re-ejecuta en cada render.
  useEffect(() => stop, [stop]);

  return { reproduciendo, sonando, play, stop };
}
