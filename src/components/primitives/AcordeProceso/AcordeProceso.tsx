import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine, stopAllNotes } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import {
  chordSpelled,
  spelledChromaticCircle,
  spelledIntervalFromTonic,
} from '../../../utils/noteCalculations';
import { useProcessAnimation } from '../../modules/t2/hooks/useProcessAnimation';
import Prose from '../../shared/Prose/Prose';
import AcordesBuilder, { PLAYING_ALL } from '../AcordesBuilder/AcordesBuilder';
import type { NoteSpelling, Tonic } from '../../../types/music';
import type { ProseSegment, ProseFragment } from '../../../types/prose';
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
const PATH_BY_STEP: string[][] = [
  [], // paso 1 · sólo la tónica
  ['3M'], // paso 2 · tercera mayor
  ['3M', '5'], // paso 3 · quinta justa
  ['3M', '5'], // paso 4 · resultado (suena en bloque)
];

const PLAYING_BY_STEP: (string | null)[] = ['T', '3M', '5', PLAYING_ALL];

const ASCII = (s: string) => s.replace('♯', '#').replace('♭', 'b');

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

export default function AcordeProceso() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isDe = locale === 'de';
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
    if (s === 0 || s === lastAudioStep.current) return;
    lastAudioStep.current = s;
    const ms = chordRef.current;
    const pn = playNoteRef.current;
    if (s >= 1 && s <= 3) pn(ms[s - 1].chromatic, ms[s - 1].octave, 1.6);
    else if (s === 4) ms.forEach((m) => pn(m.chromatic, m.octave, 2.2));
  }, [anim.currentStep]);

  const current = anim.currentStep;
  const running = current > 0;
  const playLabel =
    anim.mode === 'playing'
      ? isDe
        ? 'Pausieren'
        : 'Pausar'
      : isDe
        ? 'Abspielen'
        : 'Reproducir';

  return (
    <div className={styles.wrap}>
      <span className={styles.eyebrow}>{t('t1.s07.process_eyebrow')}</span>

      <div className={styles.layout}>
        <AcordesBuilder
          path={running ? PATH_BY_STEP[current - 1] : undefined}
          playingRole={running ? PLAYING_BY_STEP[current - 1] : null}
          onUserPick={anim.reset}
        />

        <ol className={styles.steps}>
          {steps.map((seg, i) => {
            const stepNum = i + 1;
            const active = stepNum === current;
            const past = stepNum < current;
            const isResult = stepNum === TOTAL_STEPS;
            return (
              <li
                key={i}
                className={`${styles.step} ${active ? styles.stepActive : ''} ${past ? styles.stepPast : ''} ${isResult ? styles.stepResult : ''}`}
                aria-current={active ? 'step' : undefined}
              >
                <span className={styles.stepNum}>{stepNum}</span>
                <Prose segment={seg} />
              </li>
            );
          })}
        </ol>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.ctrl}
          onClick={anim.prev}
          disabled={current <= 0}
          aria-label={isDe ? 'Vorheriger Schritt' : 'Paso anterior'}
        >
          ◀
        </button>
        <button
          type="button"
          className={styles.ctrl}
          onClick={anim.mode === 'playing' ? anim.pause : anim.play}
          aria-label={playLabel}
        >
          {anim.mode === 'playing' ? '⏸' : '▶'}
        </button>
        <button
          type="button"
          className={styles.ctrl}
          onClick={anim.next}
          disabled={current >= TOTAL_STEPS}
          aria-label={isDe ? 'Nächster Schritt' : 'Paso siguiente'}
        >
          ▶▶
        </button>
        <span className={styles.spacer} />
        <label className={styles.speedWrap}>
          <span className={styles.speedLabel}>
            {isDe ? 'Tempo' : 'Velocidad'}
          </span>
          <select
            className={styles.speedSelect}
            value={anim.speed}
            onChange={(e) => anim.setSpeed(e.target.value as 'normal' | 'slow')}
          >
            <option value="normal">normal</option>
            <option value="slow">{isDe ? 'langsam' : 'lento'}</option>
          </select>
        </label>
      </div>
    </div>
  );
}
