import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { ALL } from '../../../data/notes';
import { majorScaleSpelled } from '../../../utils/noteCalculations';
import NoteToken from '../../shared/NoteToken/NoteToken';
import type { ChromaticNote, NoteSpelling } from '../../../types/music';
import styles from './GradosArmonicos.module.css';

interface Props {
  tonalidad: ChromaticNote;
}

type Step = 1 | 2 | 3;

const NATURAL_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11] as const;
const QUALITIES = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'] as const;
const ROMANS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const;

// 17 spellings cubiertos por NoteToken (12 sostenidos + 5 enarmonías bemol).
// El método permite tonalidades que producen E♯ / B♯ / dobles accidentales;
// esos casos caen como texto plano (decisión doctrinal §7).
const VALID_SPELLINGS: ReadonlySet<string> = new Set([
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Db', 'Eb', 'Gb', 'Ab', 'Bb',
]);

const ARPEGGIO_GAP_MS = 220;
const NOTE_DURATION = 1.4;
const FIRE_DEBOUNCE_MS = 150;

interface DiatonicNote {
  spelled: string;        // glifo ♯/♭
  ascii: string;          // ASCII (#/b) para detectar tokenizable
  chromatic: ChromaticNote;
  octave: number;
}

function buildDiatonic(tonic: ChromaticNote): DiatonicNote[] {
  const tIdx = ALL.indexOf(tonic);
  const spelled = majorScaleSpelled(tonic);
  return MAJOR_INTERVALS.map((semis, i) => ({
    spelled: spelled[i],
    ascii: spelled[i].replace('♯', '#').replace('♭', 'b'),
    chromatic: ALL[(tIdx + semis) % 12],
    octave: 4 + Math.floor((tIdx + semis) / 12),
  }));
}

// Letras naturales rotadas desde la letra-tónica (estado 1).
function naturalRoots(tonic: ChromaticNote): string[] {
  const startIdx = NATURAL_LETTERS.indexOf(tonic[0] as typeof NATURAL_LETTERS[number]);
  return Array.from({ length: 7 }, (_, i) => NATURAL_LETTERS[(startIdx + i) % 7]);
}

// Octava ascendente del miembro de la tríada respecto a la raíz del grado.
function chordMemberOctave(diatonic: DiatonicNote[], gradeIdx: number, offset: number): number {
  const idx = (gradeIdx + offset) % 7;
  const wraps = gradeIdx + offset >= 7 ? 1 : 0;
  return diatonic[idx].octave + wraps;
}

export default function GradosArmonicos({ tonalidad }: Props) {
  const [step, setStep] = useState<Step>(1);
  const { playNote } = useAudioEngine();
  const lastFireRef = useRef<number>(0);

  const diatonic = useMemo(() => buildDiatonic(tonalidad), [tonalidad]);
  const naturals = useMemo(() => naturalRoots(tonalidad), [tonalidad]);

  const playTriad = useCallback(
    (gradeIdx: number) => {
      const now = performance.now();
      if (now - lastFireRef.current < FIRE_DEBOUNCE_MS) return;
      lastFireRef.current = now;

      const root = diatonic[gradeIdx];
      const third = diatonic[(gradeIdx + 2) % 7];
      const fifth = diatonic[(gradeIdx + 4) % 7];
      const rootOct = root.octave;
      const thirdOct = chordMemberOctave(diatonic, gradeIdx, 2);
      const fifthOct = chordMemberOctave(diatonic, gradeIdx, 4);

      playNote(root.chromatic, rootOct, NOTE_DURATION);
      setTimeout(() => playNote(third.chromatic, thirdOct, NOTE_DURATION), ARPEGGIO_GAP_MS);
      setTimeout(() => playNote(fifth.chromatic, fifthOct, NOTE_DURATION), ARPEGGIO_GAP_MS * 2);
    },
    [diatonic, playNote],
  );

  // Filas Tónica/Tercera/Quinta dependen del estado: state 1 = letras naturales,
  // state ≥ 2 = scale degrees con armadura.
  const tonicaRow = step === 1 ? naturals : diatonic.map((d) => d.spelled);
  const terceraRow =
    step === 1
      ? Array.from({ length: 7 }, (_, i) => naturals[(i + 2) % 7])
      : Array.from({ length: 7 }, (_, i) => diatonic[(i + 2) % 7].spelled);
  const quintaRow =
    step === 1
      ? Array.from({ length: 7 }, (_, i) => naturals[(i + 4) % 7])
      : Array.from({ length: 7 }, (_, i) => diatonic[(i + 4) % 7].spelled);

  const escalaRow = diatonic.map((d) => d.spelled);

  // ASCII parallels para decidir tokenización por celda.
  const tonicaAscii =
    step === 1 ? naturals : diatonic.map((d) => d.ascii);
  const terceraAscii =
    step === 1
      ? Array.from({ length: 7 }, (_, i) => naturals[(i + 2) % 7])
      : Array.from({ length: 7 }, (_, i) => diatonic[(i + 2) % 7].ascii);
  const quintaAscii =
    step === 1
      ? Array.from({ length: 7 }, (_, i) => naturals[(i + 4) % 7])
      : Array.from({ length: 7 }, (_, i) => diatonic[(i + 4) % 7].ascii);
  const escalaAscii = diatonic.map((d) => d.ascii);

  const chordSymbols = diatonic.map((d, i) => {
    const q = QUALITIES[i];
    if (q === 'M') return d.spelled;
    if (q === 'm') return d.spelled + 'm';
    return d.spelled + '°';
  });

  return (
    <div className={styles.wrap}>
      <div className={styles.stepperRow} role="tablist" aria-label="Paso del procedimiento">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={step === s}
            className={step === s ? styles.stepActive : styles.step}
            onClick={() => setStep(s as Step)}
          >
            <span className={styles.stepNum}>0{s}</span>
            <span className={styles.stepLabel}>{stepLabel(s as Step)}</span>
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <tbody>
            <Row label="Escala" cells={escalaRow} ascii={escalaAscii} />
            <Row label="Tónica" cells={tonicaRow} ascii={tonicaAscii} />
            <Row label="Tercera" cells={terceraRow} ascii={terceraAscii} />
            <Row label="Quinta" cells={quintaRow} ascii={quintaAscii} />

            <tr className={`${styles.revealRow} ${step >= 3 ? styles.revealOn : ''}`}>
              <th scope="row" className={styles.rowLabel}>Grado</th>
              {ROMANS.map((roman, i) => (
                <td key={i} className={styles.gradoCell}>
                  <RomanGlyph roman={roman} />
                </td>
              ))}
            </tr>

            <tr className={`${styles.revealRow} ${step >= 3 ? styles.revealOn : ''}`}>
              <th scope="row" className={styles.rowLabel}>Acorde</th>
              {chordSymbols.map((sym, i) => (
                <ChordCell
                  key={i}
                  symbol={sym}
                  active={step >= 3}
                  onPlay={() => playTriad(i)}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function stepLabel(s: Step): string {
  if (s === 1) return 'Letras solas';
  if (s === 2) return 'Con armadura';
  return 'Calidades';
}

interface RowProps {
  label: string;
  cells: string[];
  ascii: string[];
}

function Row({ label, cells, ascii }: RowProps) {
  return (
    <tr>
      <th scope="row" className={styles.rowLabel}>{label}</th>
      {cells.map((display, i) => {
        const a = ascii[i];
        const tokenizable = VALID_SPELLINGS.has(a);
        return (
          <td key={i} className={styles.noteCell}>
            {tokenizable ? (
              <NoteToken note={a as NoteSpelling} />
            ) : (
              <span className={styles.rawNote}>{display}</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function RomanGlyph({ roman }: { roman: typeof ROMANS[number] }) {
  if (roman === 'vii°') {
    return <span className={styles.romanDim}>{roman}</span>;
  }
  // Mayúsculas → mayor (bold). Minúsculas → menor (regular).
  const isMajor = roman === roman.toUpperCase();
  return (
    <span className={isMajor ? styles.romanMajor : styles.romanMinor}>{roman}</span>
  );
}

interface ChordCellProps {
  symbol: string;
  active: boolean;
  onPlay: () => void;
}

function ChordCell({ symbol, active, onPlay }: ChordCellProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLTableCellElement>) => {
      if (!active) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlay();
      }
    },
    [active, onPlay],
  );

  return (
    <td
      className={active ? styles.chordCellActive : styles.chordCell}
      role={active ? 'button' : undefined}
      tabIndex={active ? 0 : -1}
      aria-hidden={!active}
      aria-label={active ? `Reproducir acorde ${symbol}` : undefined}
      onClick={active ? onPlay : undefined}
      onFocus={active ? onPlay : undefined}
      onKeyDown={handleKey}
    >
      <span className={styles.chordSymbol}>{symbol}</span>
    </td>
  );
}
