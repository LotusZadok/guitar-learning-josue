import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine, stopAllNotes } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import {
  chordSpelled,
  spelledChromaticCircle,
  spelledIntervalFromTonic,
} from '../../../utils/noteCalculations';
import { useProcessAnimation } from '../../modules/t2/hooks/useProcessAnimation';
import ProcessControls from '../../shared/ProcessControls/ProcessControls';
import Prose from '../../shared/Prose/Prose';
import AcordesBuilder, { PLAYING_ALL } from '../AcordesBuilder/AcordesBuilder';
import { BUILDER_17 } from '../AcordesBuilder/configs';
import type { NoteSpelling, Tonic } from '../../../types/music';
import type { ProseSegment, ProseFragment } from '../../../types/prose';
import chrome from '../../shared/processChrome.module.css';
import styles from './AcordeProceso.module.css';

// §1.7 · El ejemplo por pasos deja de ser una lista muerta: recorre el árbol
// iluminando y sonando cada nota. Reutiliza la máquina de pasos de §2.3/§2.4
// (respeta prefers-reduced-motion) y el árbol de AcordesBuilder en modo
// controlado · un solo diagrama, no dos.
//
// Construye SIEMPRE la tríada mayor (decisión del profesor, 31/7/26). Menor y
// disminuido viven en el bloque de resultado de la sección, sin animación.

const TOTAL_STEPS = 4;

// Camino del acorde mayor en BUILDER_17: T → 3M → 5J.
//
// OJO · acoplamiento no verificable por el compilador: estos literales deben
// coincidir con los `role` de los nodos de BUILDER_17 en configs.ts, y
// `BuilderNode.role` está tipado `string`. Si alguien renombra '3M' o '5' allá,
// el walkthrough deja de iluminar y de sonar sin que tsc diga nada.
const PATH_BY_STEP: string[][] = [
  [], // paso 1 · sólo la tónica
  ['3M'], // paso 2 · tercera mayor
  ['3M', '5'], // paso 3 · quinta justa
  ['3M', '5'], // paso 4 · resultado (suena en bloque)
];

const PLAYING_BY_STEP: (string | null)[] = ['T', '3M', '5', PLAYING_ALL];

const ASCII = (s: string) => s.replace('♯', '#').replace('♭', 'b');

// Los ProseSegment se aplanan a texto para la región viva: aria-live necesita
// un cambio de texto real, no un cambio de clase.
const segmentText = (seg: ProseSegment): string =>
  seg.map((f) => f.value).join('');

function buildPasoLetras(tonic: Tonic, locale: string): ProseSegment {
  const [t1, t3, t5] = chordSpelled(tonic, 'M').map(
    (m) => ASCII(m.spelled) as NoteSpelling,
  );
  const prefix =
    locale === 'de' ? 'Buchstaben der Trias: ' : 'Letras de la tríada: ';
  return [
    { type: 'text', value: prefix },
    { type: 'note', value: t1 },
    { type: 'text', value: ' ' },
    { type: 'note', value: t3 },
    { type: 'text', value: ' ' },
    { type: 'note', value: t5 },
    { type: 'text', value: '.' },
  ];
}

function buildPasoSemitonos(
  tonic: Tonic,
  targetSemis: number,
  targetSpelled: string,
  letterRuleNote: string,
  locale: string,
): ProseSegment {
  const circle = spelledChromaticCircle(tonic);
  const tonicAscii = ASCII(circle[0].sharp) as NoteSpelling;
  const isTercera = targetSemis === 4;
  const prefix =
    locale === 'de'
      ? isTercera
        ? 'Halbtöne bis zur gr. Terz: '
        : 'Halbtöne bis zur r. Quinte: '
      : isTercera
        ? 'Semitonos hasta la 3M: '
        : 'Semitonos hasta la 5J: ';

  const seg: ProseFragment[] = [
    { type: 'text', value: prefix },
    { type: 'note', value: tonicAscii },
  ];
  for (let i = 1; i <= targetSemis; i++) {
    const step = circle[i];
    seg.push({ type: 'text', value: ' → ' });
    const sharpAscii = ASCII(step.sharp) as NoteSpelling;
    if (step.flat) {
      const flatAscii = ASCII(step.flat) as NoteSpelling;
      seg.push(
        { type: 'note', value: sharpAscii },
        { type: 'text', value: '/' },
        { type: 'note', value: flatAscii },
      );
    } else {
      seg.push({ type: 'note', value: sharpAscii });
    }
    seg.push({ type: 'text', value: ` (${i})` });
  }

  // Solo añadimos la caveat de la "regla del paso 1" en la 3M cuando hay ambigüedad enarmónica.
  const finalStep = circle[targetSemis];
  if (isTercera && finalStep.flat) {
    const correctAscii = ASCII(targetSpelled) as NoteSpelling;
    const altAscii = ASCII(
      correctAscii.length === 2 && correctAscii[1] === '#'
        ? (finalStep.flat as string)
        : (finalStep.sharp as string),
    ) as NoteSpelling;
    seg.push({
      type: 'text',
      value:
        locale === 'de'
          ? '. Nach der Regel aus Schritt 1 ist der Buchstabe '
          : '. Por la regla del paso 1, la letra es ',
    });
    seg.push({ type: 'note', value: ASCII(letterRuleNote) as NoteSpelling });
    seg.push({
      type: 'text',
      value: locale === 'de' ? ', also ist es ' : ', entonces es ',
    });
    seg.push({ type: 'note', value: correctAscii });
    seg.push({ type: 'text', value: locale === 'de' ? ' (nicht ' : ' (no ' });
    seg.push({ type: 'note', value: altAscii });
    seg.push({ type: 'text', value: ').' });
  } else {
    seg.push({ type: 'text', value: '.' });
  }
  return seg;
}

function buildPasoResultado(tonic: Tonic, locale: string): ProseSegment {
  const members = chordSpelled(tonic, 'M');
  const prefix = locale === 'de' ? 'Ergebnis: ' : 'Resultado: ';
  const suffix = locale === 'de' ? ' · der Durakkord.' : ' · el acorde mayor.';
  const seg: ProseFragment[] = [{ type: 'text', value: prefix }];
  members.forEach((m, i) => {
    if (i > 0) seg.push({ type: 'text', value: ' ' });
    seg.push({ type: 'note', value: ASCII(m.spelled) as NoteSpelling });
  });
  seg.push({ type: 'text', value: suffix });
  return seg;
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

  const chordM = useMemo(() => chordSpelled(tonic, 'M'), [tonic]);

  const steps = useMemo<ProseSegment[]>(() => {
    const tercera = spelledIntervalFromTonic(tonic, 3, 'M');
    return [
      buildPasoLetras(tonic, locale),
      buildPasoSemitonos(tonic, 4, tercera, tercera[0], locale),
      buildPasoSemitonos(
        tonic,
        7,
        spelledIntervalFromTonic(tonic, 5, 'P'),
        '',
        locale,
      ),
      buildPasoResultado(tonic, locale),
    ];
  }, [tonic, locale]);

  // Refs para leer los valores más recientes sin que su cambio de referencia
  // re-dispare el efecto de audio: ese efecto sólo debe sonar cuando cambia el
  // número de paso (mismo patrón que TriadaProceso).
  const chordRef = useRef(chordM);
  const playNoteRef = useRef(playNote);
  chordRef.current = chordM;
  playNoteRef.current = playNote;

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
    if (s >= 1 && s <= 3) pn(ms[s - 1].chromatic, ms[s - 1].octave, 1.6);
    else if (s === 4) ms.forEach((m) => pn(m.chromatic, m.octave, 2.2));
  }, [anim.currentStep]);

  // El estudiante tocó un nodo: soltamos el control y callamos las notas del
  // paso en curso, que si no seguirían sonando sobre un árbol ya libre.
  const { reset } = anim;
  const releaseControl = useCallback(() => {
    reset();
    stopAllNotes();
  }, [reset]);

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
        {running ? segmentText(steps[current - 1]) : ''}
      </p>

      <div className={styles.layout}>
        <AcordesBuilder
          config={BUILDER_17}
          path={running ? PATH_BY_STEP[current - 1] : undefined}
          playingRole={running ? PLAYING_BY_STEP[current - 1] : null}
          onUserPick={releaseControl}
        />

        <ol className={chrome.steps}>
          {steps.map((seg, i) => {
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
                <Prose segment={seg} />
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
