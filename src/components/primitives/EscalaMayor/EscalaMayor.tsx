import { useCallback, useMemo, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine, stopAllNotes } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { ALL, NOTE_COLORS, NOTE_ES } from '../../../data/notes';

const NOTE_DE_LETTER: Record<string, string> = {
  C: 'C', 'C#': 'Cis', D: 'D', 'D#': 'Dis', E: 'E', F: 'F',
  'F#': 'Fis', G: 'G', 'G#': 'Gis', A: 'A', 'A#': 'B', B: 'H',
};
import { majorScaleSpelled, spelledNameES, tonicChromatic } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './EscalaMayor.module.css';

// Major scale: positions 0, 2, 4, 5, 7, 9, 11, plus closing octave at 12.
// Tonic (T): 0, 12. Stable (III, V): 4, 7. Intermediate (II, VI): 2, 9. Tense (IV, VII): 5, 11.
// Chromatic off-scale degrees: 1, 3, 6, 8, 10.

const SCALE_POSITIONS = [0, 2, 4, 5, 7, 9, 11, 12] as const;
// Reunión 24/5/26: calidades en lugar de romanos en el visualizador.
const GRADE_LABELS = ['T', '2M', '3M', '4J', '5J', '6M', '7M', '8J'] as const;
const STABLE_POSITIONS = new Set<number>([4, 7]);
const INTERMEDIATE_POSITIONS = new Set<number>([2, 9]);
const TENSE_POSITIONS = new Set<number>([5, 11]);

const NODE_COUNT = 13;
const SVG_W = 560;
const SVG_H = 200;
const PAD_X = 32;
const STEP_X = (SVG_W - 2 * PAD_X) / (NODE_COUNT - 1);
const NODE_Y = 100;

interface NodeData {
  position: number;
  cx: number;
  chromatic: ChromaticNote;
  octaveAdj: number;
  scaleIdx: number | null;
  spelled: string | null;
  grade: string | null;
  role: 'tonic' | 'stable' | 'intermediate' | 'tense' | 'chromatic';
}

export default function EscalaMayor() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();

  const nodes = useMemo<NodeData[]>(() => {
    const tonicIdx = ALL.indexOf(tonicChromatic(tonic));
    const spelledScale = majorScaleSpelled(tonic);
    const scaleByPos = new Map<number, number>();
    SCALE_POSITIONS.forEach((p, i) => scaleByPos.set(p, i));

    return Array.from({ length: NODE_COUNT }, (_, p): NodeData => {
      const cx = PAD_X + p * STEP_X;
      const absChromIdx = (tonicIdx + p) % 12;
      const chromatic = ALL[absChromIdx];
      const octaveAdj = Math.floor((tonicIdx + p) / 12);
      const scaleIdx = scaleByPos.get(p) ?? null;
      const spelled = scaleIdx !== null ? spelledScale[scaleIdx % 7] : null;
      const grade = scaleIdx !== null ? GRADE_LABELS[scaleIdx] : null;

      let role: NodeData['role'] = 'chromatic';
      if (p === 0 || p === 12) role = 'tonic';
      else if (STABLE_POSITIONS.has(p)) role = 'stable';
      else if (INTERMEDIATE_POSITIONS.has(p)) role = 'intermediate';
      else if (TENSE_POSITIONS.has(p)) role = 'tense';

      return { position: p, cx, chromatic, octaveAdj, scaleIdx, spelled, grade, role };
    });
  }, [tonic]);

  const handlePlay = useCallback(
    (chromatic: ChromaticNote, octaveAdj: number) => {
      // Cortar la nota anterior para que al recorrer la escala no se acumulen.
      stopAllNotes();
      playNote(chromatic, 4 + octaveAdj, 1.4);
    },
    [playNote],
  );

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        role="img"
        aria-label={isDe ? `Dur-Tonleiter von ${NOTE_DE_LETTER[tonicChromatic(tonic)] ?? tonic}` : `Escala mayor de ${spelledNameES(tonic)}`}
      >
        {/* Subtle baseline rule between nodes */}
        <line
          x1={PAD_X}
          y1={NODE_Y}
          x2={SVG_W - PAD_X}
          y2={NODE_Y}
          className={styles.baseline}
        />

        {nodes.map((n) => (
          <ScaleNode key={n.position} data={n} onPlay={handlePlay} isDe={isDe} />
        ))}
      </svg>
    </div>
  );
}

interface ScaleNodeProps {
  data: NodeData;
  onPlay: (chromatic: ChromaticNote, octaveAdj: number) => void;
  isDe?: boolean;
}

function ScaleNode({ data, onPlay, isDe }: ScaleNodeProps) {
  const { cx, chromatic, octaveAdj, role, spelled, grade } = data;
  const isOnScale = role !== 'chromatic';

  const radius =
    role === 'tonic' ? 22 :
    role === 'chromatic' ? 11 :
    18;
  const opacity = role === 'chromatic' ? 0.2 : 1;
  const fill =
    role === 'chromatic' ? NOTE_COLORS[chromatic] :
    role === 'intermediate' ? 'var(--diatonic-medium)' :
    role === 'tense' ? 'var(--diatonic-tense)' :
    'var(--diatonic-stable)'; // tonic + stable

  // Reunión 24/5/26: las notas fuera de escala (cromáticas tenues) no deben sonar.
  // Reunión 9/6/26 (1.4): suena solo al ENTRAR al círculo (no al salir).
  const handleEnter = useCallback(() => {
    if (isOnScale) onPlay(chromatic, octaveAdj);
  }, [chromatic, octaveAdj, onPlay, isOnScale]);
  const handleKey = useCallback(
    (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isOnScale) onPlay(chromatic, octaveAdj);
      }
    },
    [chromatic, octaveAdj, onPlay, isOnScale],
  );

  return (
    <g
      className={styles.node}
      tabIndex={isOnScale ? 0 : -1}
      role={isOnScale ? 'button' : undefined}
      aria-label={isOnScale ? (isDe
        ? `${NOTE_DE_LETTER[chromatic] ?? chromatic}${grade ? ` · Stufe ${grade}` : ''}`
        : `${NOTE_ES[chromatic]}${grade ? ` · grado ${grade}` : ''}`) : undefined}
      onFocus={isOnScale ? handleEnter : undefined}
      onKeyDown={isOnScale ? handleKey : undefined}
    >
      {/* Hit area: solo en notas de la escala (las cromáticas son silenciosas) */}
      {isOnScale && (
        <circle
          cx={cx}
          cy={NODE_Y}
          r={Math.max(radius + 6, 18)}
          fill="transparent"
          onMouseEnter={handleEnter}
        />
      )}

      {/* Spelled note name above (scale notes only) */}
      {spelled && (
        <text x={cx} y={NODE_Y - radius - 30} className={styles.noteName}>
          {spelled}
        </text>
      )}

      {/* Visible node */}
      <circle
        cx={cx}
        cy={NODE_Y}
        r={radius}
        fill={fill}
        opacity={opacity}
        stroke={role === 'tonic' ? 'var(--paper)' : 'none'}
        strokeWidth={role === 'tonic' ? 2 : 0}
      />

      {/* Inner letter (Signature Component): only on scale nodes */}
      {isOnScale && spelled && (
        <text
          x={cx}
          y={NODE_Y + 1}
          className={role === 'tonic' ? styles.innerLetterLarge : styles.innerLetter}
        >
          {spelled}
        </text>
      )}

      {/* Grade label below (scale notes only) */}
      {grade && (
        <text x={cx} y={NODE_Y + radius + 22} className={styles.gradeLabel}>
          {grade}
        </text>
      )}
    </g>
  );
}
