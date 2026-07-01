import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { ALL } from '../../../data/notes';
import { majorScaleSpelled, spelledSequenceAscending, tonicChromatic } from '../../../utils/noteCalculations';
import NoteToken, { type DiatonicRole } from '../../shared/NoteToken/NoteToken';
import type { ChromaticNote, NoteSpelling, Tonic } from '../../../types/music';
import styles from './GradosArmonicos.module.css';

type Step = 1 | 2 | 3 | 4;

interface Props {
  tonalidad: Tonic;
  /** Paso inicial del stepper. T3 §3.5 arranca en 4 (Séptimas); T2 en 1. */
  initialStep?: Step;
}

const NATURAL_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11] as const;
const QUALITIES = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'] as const;
const SEVENTH_QUALITIES = ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7♭5'] as const;
const ROMANS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const;

/** Maps diatonic degree (0-based) → diatonic role color (formato diatónico,
 *  para la fila Escala donde se ve la estabilidad nota-a-nota). */
const DEGREE_ROLE: DiatonicRole[] = [
  'stable',  // 1 — Tónica
  'medium',  // 2 — Supertónica
  'stable',  // 3 — Mediante
  'tense',   // 4 — Subdominante
  'stable',  // 5 — Dominante
  'medium',  // 6 — Superdominante
  'tense',   // 7 — Sensible
];

/** Reunión 24/5/26: formato armónico para los grados y acordes diatónicos.
 *  Refleja la función dentro de la tonalidad (no la estabilidad nota-a-nota).
 *  I y vi → reposo · ii y iii → medio · IV → medio-tenso · V y vii → tenso. */
const HARMONIC_ROLE: DiatonicRole[] = [
  'stable',       // I   — reposo
  'medium',       // ii  — medio
  'medium',       // iii — medio
  'mediumTense',  // IV  — medio-tenso
  'tense',        // V   — tenso
  'stable',       // vi  — reposo
  'tense',        // vii — tenso
];

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

function buildDiatonic(tonic: Tonic): DiatonicNote[] {
  const tIdx = ALL.indexOf(tonicChromatic(tonic));
  const spelled = majorScaleSpelled(tonic);
  return MAJOR_INTERVALS.map((semis, i) => ({
    spelled: spelled[i],
    ascii: spelled[i].replace('♯', '#').replace('♭', 'b'),
    chromatic: ALL[(tIdx + semis) % 12],
    octave: 4 + Math.floor((tIdx + semis) / 12),
  }));
}

// Letras naturales rotadas desde la letra-tónica (estado 1).
function naturalRoots(tonic: Tonic): string[] {
  const startIdx = NATURAL_LETTERS.indexOf(tonic[0] as typeof NATURAL_LETTERS[number]);
  return Array.from({ length: 7 }, (_, i) => NATURAL_LETTERS[(startIdx + i) % 7]);
}

// Octava ascendente del miembro de la tríada respecto a la raíz del grado.
function chordMemberOctave(diatonic: DiatonicNote[], gradeIdx: number, offset: number): number {
  const idx = (gradeIdx + offset) % 7;
  const wraps = gradeIdx + offset >= 7 ? 1 : 0;
  return diatonic[idx].octave + wraps;
}

export default function GradosArmonicos({ tonalidad, initialStep = 1 }: Props) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const [step, setStep] = useState<Step>(initialStep);
  const [playingCell, setPlayingCell] = useState<number | null>(null);
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

      setPlayingCell(gradeIdx);
      playNote(root.chromatic, rootOct, NOTE_DURATION);
      setTimeout(() => playNote(third.chromatic, thirdOct, NOTE_DURATION), ARPEGGIO_GAP_MS);
      setTimeout(() => playNote(fifth.chromatic, fifthOct, NOTE_DURATION), ARPEGGIO_GAP_MS * 2);

      const totalMs = step >= 4
        ? ARPEGGIO_GAP_MS * 3 + NOTE_DURATION * 1000
        : ARPEGGIO_GAP_MS * 2 + NOTE_DURATION * 1000;

      if (step >= 4) {
        const seventh = diatonic[(gradeIdx + 6) % 7];
        const seventhOct = chordMemberOctave(diatonic, gradeIdx, 6);
        setTimeout(() => playNote(seventh.chromatic, seventhOct, NOTE_DURATION), ARPEGGIO_GAP_MS * 3);
      }

      setTimeout(() => setPlayingCell(null), totalMs);
    },
    [diatonic, playNote, step],
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
  const septRow = step === 1
    ? Array.from({ length: 7 }, (_, i) => naturals[(i + 6) % 7])
    : Array.from({ length: 7 }, (_, i) => diatonic[(i + 6) % 7].spelled);
  const septAscii = step === 1
    ? Array.from({ length: 7 }, (_, i) => naturals[(i + 6) % 7])
    : Array.from({ length: 7 }, (_, i) => diatonic[(i + 6) % 7].ascii);
  const escalaAscii = diatonic.map((d) => d.ascii);

  const chordSymbols = diatonic.map((d, i) => {
    if (step >= 4) return d.spelled + SEVENTH_QUALITIES[i];
    const q = QUALITIES[i];
    if (q === 'M') return d.spelled;
    if (q === 'm') return d.spelled + 'm';
    return d.spelled + '°';
  });

  const displayChords = chordSymbols;

  return (
    <div className={styles.wrap}>
      <div className={styles.stepperRow} role="tablist" aria-label={isDe ? 'Verfahrensschritt' : 'Paso del procedimiento'}>
        {([1, 2, 3, 4] as Step[]).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={step === s}
            className={step === s ? styles.stepActive : styles.step}
            onClick={() => setStep(s)}
          >
            <span className={styles.stepNum}>0{s}</span>
            <span className={styles.stepLabel}>{stepLabel(s, isDe)}</span>
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <tbody>
            <Row
              label={isDe ? 'Tonleiter' : 'Escala'}
              cells={escalaRow}
              ascii={escalaAscii}
              roles={DEGREE_ROLE}
            />
            <TriadaRow
              tonicaRow={tonicaRow} tonicaAscii={tonicaAscii}
              terceraRow={terceraRow} terceraAscii={terceraAscii}
              quintaRow={quintaRow} quintaAscii={quintaAscii}
              septRow={step >= 4 ? septRow : undefined}
              septAscii={step >= 4 ? septAscii : undefined}
              isDe={isDe}
            />

            <tr className={`${styles.revealRow} ${step >= 3 ? styles.revealOn : ''}`}>
              <th scope="row" className={styles.rowLabel}>{isDe ? 'Stufe' : 'Grado'}</th>
              {ROMANS.map((roman, i) => (
                <td key={i} className={styles.gradoCell} data-harmonic={HARMONIC_ROLE[i]}>
                  <RomanGlyph roman={roman} role={HARMONIC_ROLE[i]} />
                </td>
              ))}
            </tr>

            <tr className={`${styles.revealRow} ${step >= 3 ? styles.revealOn : ''}`}>
              <th scope="row" className={styles.rowLabel}>{isDe ? 'Akkord' : 'Acorde'}</th>
              {displayChords.map((sym, i) => (
                <ChordCell
                  key={i}
                  symbol={sym}
                  role={HARMONIC_ROLE[i]}
                  active={step >= 3}
                  onPlay={() => playTriad(i)}
                  isPlaying={playingCell === i}
                  isDimmed={playingCell !== null && playingCell !== i}
                  isDe={isDe}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function stepLabel(s: Step, isDe: boolean): string {
  if (s === 1) return isDe ? 'Nur Buchstaben' : 'Letras solas';
  if (s === 2) return isDe ? 'Mit Vorzeichen' : 'Con armadura';
  if (s === 3) return isDe ? 'Qualitäten' : 'Calidades';
  return isDe ? 'Septimen' : 'Séptimas';
}

interface RowProps {
  label: string;
  cells: string[];
  ascii: string[];
  roles?: DiatonicRole[];
}

function Row({ label, cells, ascii, roles }: RowProps) {
  return (
    <tr>
      <th scope="row" className={styles.rowLabel}>{label}</th>
      {cells.map((display, i) => {
        const a = ascii[i];
        const tokenizable = VALID_SPELLINGS.has(a);
        return (
          <td key={i} className={styles.noteCell}>
            {tokenizable ? (
              <NoteToken note={a as NoteSpelling} diatonicRole={roles?.[i]} />
            ) : (
              <span className={styles.rawNote}>{display}</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function RomanGlyph({ roman, role }: { roman: typeof ROMANS[number]; role: DiatonicRole }) {
  // Reunión 24/5/26: color por formato armónico (no por mayor/menor visual).
  const isMajor = roman === roman.toUpperCase() && roman !== 'vii°';
  const isDim = roman === 'vii°';
  return (
    <span
      className={isDim ? styles.romanDim : (isMajor ? styles.romanMajor : styles.romanMinor)}
      data-harmonic={role}
    >
      {roman}
    </span>
  );
}

interface TriadaRowProps {
  tonicaRow: string[];
  tonicaAscii: string[];
  terceraRow: string[];
  terceraAscii: string[];
  quintaRow: string[];
  quintaAscii: string[];
  septRow?: string[];
  septAscii?: string[];
  isDe?: boolean;
}

function TriadaRow({ tonicaRow, tonicaAscii, terceraRow, terceraAscii, quintaRow, quintaAscii, septRow, septAscii, isDe }: TriadaRowProps) {
  const withSept = septRow !== undefined && septAscii !== undefined;
  return (
    <tr>
      <th scope="row" className={styles.rowLabel}>{withSept ? (isDe ? 'Akkord' : 'Acorde') : (isDe ? 'Dreiklang' : 'Tríada')}</th>
      {tonicaRow.map((_, i) => {
        const members: { display: string; ascii: string }[] = [
          { display: tonicaRow[i], ascii: tonicaAscii[i] },
          { display: terceraRow[i], ascii: terceraAscii[i] },
          { display: quintaRow[i], ascii: quintaAscii[i] },
        ];
        if (withSept) {
          members.push({ display: septRow[i], ascii: septAscii![i] });
        }
        // Octavas ascendentes para que el acorde apilado suene de grave a agudo
        // (la raíz abajo), igual que el arpegio de la fila de acordes (§2.6).
        const octaves = spelledSequenceAscending(members.map((m) => m.ascii), 4).map((x) => x.octave);
        return (
          <td key={i} className={styles.triadaCell}>
            <div className={styles.triadStack}>
              {members.map((m, j) => {
                const degree = (i + j * 2) % 7;
                return VALID_SPELLINGS.has(m.ascii) ? (
                  <NoteToken key={j} note={m.ascii as NoteSpelling} diatonicRole={DEGREE_ROLE[degree]} octave={octaves[j]} />
                ) : (
                  <span key={j} className={styles.rawNote}>{m.display}</span>
                );
              })}
            </div>
          </td>
        );
      })}
    </tr>
  );
}

interface ChordCellProps {
  symbol: string;
  role: DiatonicRole;
  active: boolean;
  onPlay: () => void;
  isPlaying?: boolean;
  isDimmed?: boolean;
  isDe?: boolean;
}

function ChordCell({ symbol, role, active, onPlay, isPlaying, isDimmed, isDe }: ChordCellProps) {
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

  let className = active ? styles.chordCellActive : styles.chordCell;
  if (active && isPlaying) className = `${styles.chordCellActive} ${styles.chordCellPlaying}`;
  else if (active && isDimmed) className = `${styles.chordCellActive} ${styles.chordCellDimmed}`;

  return (
    <td
      className={className}
      data-harmonic={role}
      role={active ? 'button' : undefined}
      tabIndex={active ? 0 : -1}
      aria-hidden={!active}
      aria-label={active ? (isDe ? `Akkord ${symbol} spielen` : `Reproducir acorde ${symbol}`) : undefined}
      onClick={active ? onPlay : undefined}
      onFocus={active ? onPlay : undefined}
      onKeyDown={handleKey}
    >
      <span className={styles.chordSymbol}>{symbol}</span>
    </td>
  );
}
