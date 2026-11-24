import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine, stopAllNotes } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import {
  aAscii,
  chordSpelled,
  formatNote,
  esNoteSpelling,
  letrasDeTriada,
  otrasGrafias,
  pasoSemitonos,
  type ChordType,
  type IntervalQuality,
  type PasoCromatico,
} from '../../../utils/noteCalculations';
import { useProcessAnimation } from '../../modules/t2/hooks/useProcessAnimation';
import { caminoPorPaso } from '../../../utils/procesos';
import ProcessControls from '../../shared/ProcessControls/ProcessControls';
import Prose from '../../shared/Prose/Prose';
import AcordesBuilder, { PLAYING_ALL } from '../AcordesBuilder/AcordesBuilder';
import { BUILDER_17 } from '../AcordesBuilder/configs';
import type { Tonic } from '../../../types/music';
import type { ProseSegment, ProseFragment } from '../../../types/prose';
import chrome from '../../shared/processChrome.module.css';
import styles from './AcordeProceso.module.css';

// §1.7 · El ejemplo por pasos deja de ser una lista muerta: recorre el árbol
// iluminando y sonando cada nota. Reutiliza la máquina de pasos de §2.3/§2.4
// (respeta prefers-reduced-motion) y el árbol de AcordesBuilder en modo
// controlado · un solo diagrama, no dos.
//
// Reunión 19/8/26: el proceso deja de ser siempre mayor. Arranca en la tríada
// mayor, pero si el estudiante elige otra tercera o quinta en el árbol, los
// pasos (semitonos, resultado) y el recorrido animado se re-anclan a ESA tríada.
// La decisión previa (31/7/26, "construye SIEMPRE la mayor") queda superada.

const TOTAL_STEPS = 4;

// OJO · acoplamiento no verificable por el compilador: estos literales deben
// coincidir con los `role` de los nodos de BUILDER_17 en configs.ts, y
// `BuilderNode.role` está tipado `string`. Si alguien renombra '3M' o '5' allá,
// el walkthrough deja de iluminar y de sonar sin que tsc diga nada.
type Tercera = '3m' | '3M';
type Quinta = '5' | '5d';

// Las tres tríadas que BUILDER_17 puede armar. 3M+5d no existe como camino.
const TIPO_POR_SELECCION = (t: Tercera, q: Quinta): ChordType =>
  t === '3M' ? 'M' : q === '5d' ? 'dim' : 'm';

// Un paso es su texto y, en los pasos 2 y 3, la fila cromática con los
// semitonos debajo y la aclaración de la letra (reunión 22/11/26, #21).
interface Paso {
  texto: ProseSegment;
  fila?: PasoCromatico[];
  aclaracion?: ProseSegment;
}

// Las grafías que NoteToken no conoce (B♭♭, F♭…) van como texto con glifo.
const fragmentoNota = (grafia: string, lang: string, octave?: number): ProseFragment => {
  const ascii = aAscii(grafia);
  return esNoteSpelling(ascii)
    ? { type: 'note', value: ascii, octave }
    : { type: 'text', value: formatNote(grafia, lang) };
};

// Los ProseSegment se aplanan a texto para la región viva: aria-live necesita
// un cambio de texto real, no un cambio de clase.
const segmentText = (seg: ProseSegment): string =>
  seg.map((f) => f.value).join('');

const pasoText = (paso: Paso): string =>
  [
    segmentText(paso.texto),
    paso.fila?.map((c) => c.notas.join('/')).join(' '),
    paso.aclaracion && segmentText(paso.aclaracion),
  ]
    .filter(Boolean)
    .join(' ');

// #19: solo letras, como texto plano. Una letra natural como NoteToken sonaría
// y se colorearía como la nota equivocada (La en vez de La♭).
function buildPasoLetras(tonic: Tonic, locale: string): Paso {
  const prefix =
    locale === 'de' ? 'Buchstaben der Trias: ' : 'Letras de la tríada: ';
  return { texto: [{ type: 'text', value: `${prefix}${letrasDeTriada(tonic).map((l) => formatNote(l, locale)).join(' ')}.` }] };
}

function buildPasoSemitonos(
  tonic: Tonic,
  numero: 3 | 5,
  calidad: IntervalQuality,
  locale: string,
): Paso {
  const fila = pasoSemitonos(tonic, numero, calidad);
  const llegada = fila[fila.length - 1];
  const grafia = llegada.notas[0];
  // El nombre del intervalo sigue a la selección del árbol: 3m/3M, 5d/5J.
  const nombreES: Record<number, string> = { 3: '3m', 4: '3M', 6: '5d', 7: '5J' };
  const nombreDE: Record<number, string> = {
    3: 'kl. Terz',
    4: 'gr. Terz',
    6: 'verm. Quinte',
    7: 'r. Quinte',
  };
  const prefix =
    locale === 'de'
      ? `Halbtöne bis zur ${nombreDE[llegada.semis]}:`
      : `Semitonos hasta la ${nombreES[llegada.semis]}:`;

  // La aclaración aparece cuando el círculo ofrece otra grafía en la llegada:
  // la letra del paso 1 decide (3m de Sol♭ = B♭♭, no A).
  const otras = otrasGrafias(tonic, llegada.semis, grafia);
  const aclaracion: ProseFragment[] | undefined = otras.length
    ? [
        {
          type: 'text',
          value:
            locale === 'de'
              ? `Nach der Regel aus Schritt 1 ist der Buchstabe ${formatNote(grafia[0], 'de')}, also ist es `
              : `Por la regla del paso 1, la letra es ${grafia[0]}, entonces es `,
        },
        fragmentoNota(grafia, locale, llegada.octava),
        { type: 'text', value: locale === 'de' ? ' (nicht ' : ' (no ' },
        ...otras.flatMap((o, i): ProseFragment[] => [
          ...(i > 0 ? [{ type: 'text', value: '/' } as const] : []),
          fragmentoNota(o, locale, llegada.octava),
        ]),
        { type: 'text', value: ').' },
      ]
    : undefined;

  return { texto: [{ type: 'text', value: prefix }], fila, aclaracion };
}

const NOMBRE_ACORDE: Record<ChordType, { es: string; de: string }> = {
  M: { es: 'el acorde mayor', de: 'der Durakkord' },
  m: { es: 'el acorde menor', de: 'der Mollakkord' },
  dim: { es: 'el acorde disminuido', de: 'der verminderte Akkord' },
  aug: { es: 'el acorde aumentado', de: 'der übermäßige Akkord' },
};

function buildPasoResultado(tonic: Tonic, tipo: ChordType, locale: string): Paso {
  const members = chordSpelled(tonic, tipo);
  const prefix = locale === 'de' ? 'Ergebnis: ' : 'Resultado: ';
  const nombre = NOMBRE_ACORDE[tipo];
  const suffix = locale === 'de' ? ` · ${nombre.de}.` : ` · ${nombre.es}.`;
  const seg: ProseFragment[] = [{ type: 'text', value: prefix }];
  members.forEach((m, i) => {
    if (i > 0) seg.push({ type: 'text', value: ' ' });
    seg.push(fragmentoNota(m.spelled, locale, m.octave));
  });
  seg.push({ type: 'text', value: suffix });
  return { texto: seg };
}

interface Props {
  /** Texto del eyebrow. Lo provee el consumer: una primitiva no debe alcanzar
   *  dentro del contenido de una sección concreta. */
  eyebrow: string;
}

export default function AcordeProceso({ eyebrow }: Props) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const anim = useProcessAnimation(TOTAL_STEPS);
  const lastAudioStep = useRef(0);

  // Tercera y quinta vigentes: arrancan en la tríada mayor y se re-anclan a lo
  // que el estudiante elige en el árbol (reunión 19/8/26).
  const [tercera, setTercera] = useState<Tercera>('3M');
  const [quinta, setQuinta] = useState<Quinta>('5');
  const tipo = TIPO_POR_SELECCION(tercera, quinta);

  const chordM = useMemo(() => chordSpelled(tonic, tipo), [tonic, tipo]);

  const steps = useMemo<Paso[]>(
    () => [
      buildPasoLetras(tonic, locale),
      buildPasoSemitonos(tonic, 3, tercera === '3M' ? 'M' : 'm', locale),
      buildPasoSemitonos(tonic, 5, quinta === '5' ? 'P' : 'dim', locale),
      buildPasoResultado(tonic, tipo, locale),
    ],
    [tonic, locale, tercera, quinta, tipo],
  );

  // Refs para leer los valores más recientes sin que su cambio de referencia
  // re-dispare el efecto de audio: ese efecto sólo debe sonar cuando cambia el
  // número de paso (mismo patrón que TriadaProceso).
  // En un efecto, no durante el render (react-hooks/refs) · mismo patrón que
  // TriadaProceso. Corre antes que el efecto de audio, que los lee frescos.
  const chordRef = useRef(chordM);
  const playNoteRef = useRef(playNote);
  useEffect(() => {
    chordRef.current = chordM;
    playNoteRef.current = playNote;
  });

  // Reinicia al cambiar la tónica.
  useEffect(() => {
    anim.reset();
    lastAudioStep.current = 0;
    stopAllNotes();
  }, [tonic]); // eslint-disable-line react-hooks/exhaustive-deps

  // Audio atado al paso visible (nunca audio sin estado visual paralelo).
  // Pasos 1/2/3 suenan la nota que se acaba de añadir; el paso 4 suena el
  // acorde en bloque (traslape deliberado: es un acorde).
  useEffect(() => {
    const s = anim.currentStep;
    // Volver a 0 (◀ hasta el inicio, reset por tónica, o intervención del
    // estudiante) rearma el ref: si no, el paso 1 se ilumina mudo al re-entrar.
    if (s === 0) {
      lastAudioStep.current = 0;
      return;
    }
    if (s === lastAudioStep.current) return;
    lastAudioStep.current = s;
    const ms = chordRef.current;
    const pn = playNoteRef.current;
    if (s >= 1 && s <= 3) pn(ms[s - 1].chromatic, ms[s - 1].octave, { duracion: 1.6 });
    else if (s === 4) ms.forEach((m) => pn(m.chromatic, m.octave, { duracion: 2.2 }));
  }, [anim.currentStep]);

  // El estudiante tocó un nodo: soltamos el control y callamos las notas del
  // paso en curso, que si no seguirían sonando sobre un árbol ya libre.
  const { reset } = anim;
  // El estudiante tocó un nodo: soltamos el control y re-anclamos los pasos a la
  // tercera/quinta que acaba de elegir. NO se llama `stopAllNotes()`: cortaba la
  // nota que el propio clic acaba de disparar y el árbol se sentía mudo.
  const releaseControl = useCallback(
    (selection: string[]) => {
      reset();
      const [t, q] = selection;
      if (t === '3m' || t === '3M') setTercera(t);
      if (q === '5' || q === '5d') setQuinta(q);
      // Una tercera nueva sin quinta deja la quinta anterior en pie; si esa
      // combinación no existe (3M + 5d), la quinta vuelve a la justa.
      if ((t === '3M' && !q) || (t === '3M' && q === '5d')) setQuinta('5');
    },
    [reset],
  );

  // Recorrido del walkthrough, derivado de la selección vigente.
  const playingByStep: (string | null)[] = ['T', tercera, quinta, PLAYING_ALL];

  const current = anim.currentStep;
  const running = current > 0;

  return (
    <div className={chrome.wrap}>
      <span className={chrome.eyebrow}>{eyebrow}</span>

      {/* El readout de AcordesBuilder es el único aria-live del subárbol, y en
          modo controlado no renderiza nada hasta el paso 3 (los caminos [] y
          ['3M'] no completan un acorde). Sin esto, los pasos 1 y 2 suenan sin
          par textual anunciado. */}
      <p className={styles.srOnly} role="status" aria-live="polite">
        {running ? pasoText(steps[current - 1]) : ''}
      </p>

      <div className={styles.layout}>
        <AcordesBuilder
          config={BUILDER_17}
          path={caminoPorPaso(current, tercera, quinta)}
          playingRole={running ? playingByStep[current - 1] : null}
          onUserPick={releaseControl}
        />

        <ol className={chrome.steps}>
          {steps.map((paso, i) => {
            const stepNum = i + 1;
            const active = stepNum === current;
            const past = stepNum < current;
            const isResult = stepNum === TOTAL_STEPS;
            return (
              <li
                key={i}
                className={`${chrome.step} ${active ? chrome.stepActive : ''} ${past ? chrome.stepPast : ''} ${isResult ? chrome.stepResult : ''}`}
                aria-current={active ? 'step' : undefined}
              >
                <span className={chrome.stepNum}>{stepNum}</span>
                <div className={styles.cuerpo}>
                  <Prose segment={paso.texto} />
                  {paso.fila && (
                    <ol className={styles.fila}>
                      {paso.fila.map((c) => (
                        <li key={c.semis} className={styles.celda}>
                          <span>
                            {c.notas.map((n, j) => (
                              <Fragment key={n}>
                                {j > 0 && '/'}
                                <Prose segment={[fragmentoNota(n, locale, c.octava)]} />
                              </Fragment>
                            ))}
                          </span>
                          <span className={styles.semis}>{c.semis > 0 ? `+${c.semis}` : ''}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  {paso.aclaracion && (
                    <p className={styles.aclaracion}>
                      <Prose segment={paso.aclaracion} />
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <ProcessControls
        currentStep={anim.currentStep}
        maxSteps={TOTAL_STEPS}
        mode={anim.mode}
        speed={anim.speed}
        onPlay={anim.play}
        onPause={anim.pause}
        onNext={anim.next}
        onPrev={anim.prev}
        onSpeedChange={anim.setSpeed}
      />
    </div>
  );
}
