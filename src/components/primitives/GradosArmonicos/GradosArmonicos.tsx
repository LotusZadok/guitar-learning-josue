import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useFireGate } from '../../../hooks/useFireGate';
import { ALL } from '../../../data/notes';
import { formatNote, formatChordSymbol, aAscii, gradosQueCambianEnArmonica, harmonicMinorScaleSpelled, majorScaleSpelled, MENOR_ARMONICA, relativeMinorScaleSpelled, spelledSequenceAscending, tonicChromatic } from '../../../utils/noteCalculations';
import NoteToken, { type DiatonicRole } from '../../shared/NoteToken/NoteToken';
import RomanGlyph from '../../shared/RomanGlyph/RomanGlyph';
import { GANANCIA_POR_ROL } from '../../../utils/progresionArmonica';
import type { ChromaticNote, NoteSpelling, Tonic } from '../../../types/music';
import styles from './GradosArmonicos.module.css';

type Step = 1 | 2 | 3 | 4;

interface Props {
  tonalidad: Tonic;
  /** Paso inicial del stepper. T3 §3.5 arranca en 4 (Séptimas); T2 en 1. */
  initialStep?: Step;
  /** T3 §3.9: re-ancla la tabla en la relativa menor natural de `tonalidad`
   *  (comparten armadura; misma escala rotada al 6to grado — sin teoría nueva). */
  relativeMinor?: boolean;
  /** §4.4: la relativa menor armónica (la natural con la 7ª subida). Subraya
   *  los acordes que cambian con esa nota. */
  harmonicMinor?: boolean;
  /** Último paso disponible en el stepper. T2 §2.6 usa 3 (sin séptimas);
   *  T3 §3.5/§3.9 usan el default 4, que es donde se enseñan. */
  maxStep?: 3 | 4;
}

const NATURAL_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11] as const;
const QUALITIES = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'] as const;
const SEVENTH_QUALITIES = ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7♭5'] as const;
const ROMANS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const;

// Menor natural relativa (§3.9): mismas 7 tríadas/séptimas que la mayor, leídas
// desde el 6to grado — ver `relativeMinorScaleSpelled` para la rotación de notas.
const QUALITIES_MINOR = ['m', 'dim', 'M', 'm', 'm', 'M', 'M'] as const;
const SEVENTH_QUALITIES_MINOR = ['m7', 'm7♭5', 'maj7', 'm7', 'm7', 'maj7', '7'] as const;
const ROMANS_MINOR = ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII'] as const;

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

interface DiatonicNote {
  spelled: string;        // glifo ♯/♭
  ascii: string;          // ASCII (#/b) para detectar tokenizable
  chromatic: ChromaticNote;
  octave: number;
}

function buildDiatonic(tonic: Tonic, relativeMinor: boolean, harmonicMinor: boolean): DiatonicNote[] {
  if (relativeMinor || harmonicMinor) {
    // Misma armadura, notas rotadas al 6to grado; el piso (tónica=nota más
    // grave) se recalcula con `spelledSequenceAscending` porque la rotación
    // por sí sola no preserva el ascenso (ver noteCalculations.ts).
    const spelled = harmonicMinor ? harmonicMinorScaleSpelled(tonic) : relativeMinorScaleSpelled(tonic);
    const ascii = spelled.map((s) => aAscii(s));
    const seq = spelledSequenceAscending(ascii, 4);
    return spelled.map((sp, i) => ({
      spelled: sp,
      ascii: ascii[i],
      chromatic: seq[i].name,
      octave: seq[i].octave,
    }));
  }
  const tIdx = ALL.indexOf(tonicChromatic(tonic));
  const spelled = majorScaleSpelled(tonic);
  return MAJOR_INTERVALS.map((semis, i) => ({
    spelled: spelled[i],
    ascii: aAscii(spelled[i]),
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

export default function GradosArmonicos({ tonalidad, initialStep = 1, relativeMinor = false, harmonicMinor = false, maxStep = 4 }: Props) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  // Clamp: un initialStep por encima de maxStep dejaría la tabla en un estado sin
  // pestaña que lo represente.
  const [step, setStep] = useState<Step>(Math.min(initialStep, maxStep) as Step);
  const [playingCell, setPlayingCell] = useState<number | null>(null);
  const { playNote } = useAudioEngine();
  const fire = useFireGate();
  const clearCellRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const diatonic = useMemo(() => buildDiatonic(tonalidad, relativeMinor, harmonicMinor), [tonalidad, relativeMinor, harmonicMinor]);
  // Step 1 (letras solas) parte de la tónica que se muestra en pantalla: la
  // global en mayor, o la relativa menor (1er elemento ya rotado) en menor.
  const displayTonic = relativeMinor || harmonicMinor ? (aAscii(diatonic[0].spelled) as Tonic) : tonalidad;
  const naturals = useMemo(() => naturalRoots(displayTonic), [displayTonic]);
  const QUALITIES_ACTIVE = harmonicMinor ? MENOR_ARMONICA.triadas : relativeMinor ? QUALITIES_MINOR : QUALITIES;
  const SEVENTH_QUALITIES_ACTIVE = harmonicMinor ? MENOR_ARMONICA.sufijos : relativeMinor ? SEVENTH_QUALITIES_MINOR : SEVENTH_QUALITIES;
  const ROMANS_ACTIVE = harmonicMinor ? MENOR_ARMONICA.romanos : relativeMinor ? ROMANS_MINOR : ROMANS;
  const cambian = harmonicMinor && step >= 3 ? gradosQueCambianEnArmonica(step >= 4) : [];

  const playTriad = useCallback(
    (gradeIdx: number) => {
      if (!fire()) return;

      const root = diatonic[gradeIdx];
      const third = diatonic[(gradeIdx + 2) % 7];
      const fifth = diatonic[(gradeIdx + 4) % 7];
      const rootOct = root.octave;
      const thirdOct = chordMemberOctave(diatonic, gradeIdx, 2);
      const fifthOct = chordMemberOctave(diatonic, gradeIdx, 4);

      const ganancia = GANANCIA_POR_ROL[HARMONIC_ROLE[gradeIdx]];
      setPlayingCell(gradeIdx);
      playNote(root.chromatic, rootOct, { duracion: NOTE_DURATION, ganancia });
      setTimeout(() => playNote(third.chromatic, thirdOct, { duracion: NOTE_DURATION, ganancia }), ARPEGGIO_GAP_MS);
      setTimeout(() => playNote(fifth.chromatic, fifthOct, { duracion: NOTE_DURATION, ganancia }), ARPEGGIO_GAP_MS * 2);

      const totalMs = step >= 4
        ? ARPEGGIO_GAP_MS * 3 + NOTE_DURATION * 1000
        : ARPEGGIO_GAP_MS * 2 + NOTE_DURATION * 1000;

      if (step >= 4) {
        const seventh = diatonic[(gradeIdx + 6) % 7];
        const seventhOct = chordMemberOctave(diatonic, gradeIdx, 6);
        setTimeout(() => playNote(seventh.chromatic, seventhOct, { duracion: NOTE_DURATION, ganancia }), ARPEGGIO_GAP_MS * 3);
      }

      // Un disparo nuevo cancela el apagado del anterior: si no, el timer viejo
      // apaga el resaltado a mitad del acorde que está sonando ahora.
      if (clearCellRef.current) clearTimeout(clearCellRef.current);
      clearCellRef.current = setTimeout(() => setPlayingCell(null), totalMs);
    },
    [diatonic, playNote, step, fire],
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
    if (step >= 4) return d.spelled + SEVENTH_QUALITIES_ACTIVE[i];
    const q = QUALITIES_ACTIVE[i];
    if (q === 'M') return d.spelled;
    if (q === 'm') return d.spelled + 'm';
    if (q === 'aug') return d.spelled + '+';
    return d.spelled + '°';
  });

  const displayChords = chordSymbols;

  return (
    <div className={styles.wrap}>
      <div className={styles.stepperRow} role="tablist" aria-label={isDe ? 'Verfahrensschritt' : 'Paso del procedimiento'}>
        {(Array.from({ length: maxStep }, (_, i) => (i + 1) as Step)).map((s) => (
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

            <tr className={`${styles.revealRow} ${step >= 3 ? styles.revealOn : ''}`} aria-hidden={step < 3}>
              <th scope="row" className={styles.rowLabel}>{isDe ? 'Stufe' : 'Grado'}</th>
              {ROMANS_ACTIVE.map((roman, i) => (
                <PlayableCell
                  key={i}
                  role={HARMONIC_ROLE[i]}
                  active={step >= 3}
                  onPlay={() => playTriad(i)}
                  isPlaying={playingCell === i}
                  isDimmed={playingCell !== null && playingCell !== i}
                  ariaLabel={isDe ? `Akkord der Stufe ${roman} spielen` : `Reproducir acorde del grado ${roman}`}
                  className={styles.gradoCell}
                  activeClassName={styles.gradoCellActive}
                >
                  <RomanGlyph roman={roman} role={HARMONIC_ROLE[i]} />
                </PlayableCell>
              ))}
            </tr>

            <tr className={`${styles.revealRow} ${step >= 3 ? styles.revealOn : ''}`} aria-hidden={step < 3}>
              <th scope="row" className={styles.rowLabel}>{isDe ? 'Akkord' : 'Acorde'}</th>
              {displayChords.map((sym, i) => (
                <PlayableCell
                  key={i}
                  role={HARMONIC_ROLE[i]}
                  active={step >= 3}
                  onPlay={() => playTriad(i)}
                  isPlaying={playingCell === i}
                  isDimmed={playingCell !== null && playingCell !== i}
                  ariaLabel={
                    (isDe ? `Akkord ${formatChordSymbol(sym, 'de')} spielen` : `Reproducir acorde ${sym}`) +
                    (cambian.includes(i) ? (isDe ? ', ändert sich mit dem Leitton' : ', cambia con la sensible') : '')
                  }
                  className={styles.chordCell}
                  activeClassName={styles.chordCellActive}
                  cambia={cambian.includes(i)}
                >
                  <span className={styles.chordSymbol}>{formatChordSymbol(sym, i18n.language)}</span>
                </PlayableCell>
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
  const lang = useTranslation().i18n.language;
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
              <span className={styles.rawNote}>{formatNote(display, lang)}</span>
            )}
          </td>
        );
      })}
    </tr>
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
                  <span key={j} className={styles.rawNote}>{formatNote(m.display, isDe ? 'de' : 'es')}</span>
                );
              })}
            </div>
          </td>
        );
      })}
    </tr>
  );
}

interface PlayableCellProps {
  role: DiatonicRole;
  active: boolean;
  onPlay: () => void;
  isPlaying: boolean;
  isDimmed: boolean;
  ariaLabel: string;
  className: string;
  activeClassName: string;
  /** §4.4: el acorde cambia en la menor armónica (se subraya). */
  cambia?: boolean;
  children: ReactNode;
}

// Chrome de interacción compartido por la fila Grado y la fila Acorde: ambas
// reproducen el mismo acorde de la columna (§2.6), así que el estudiante ve que
// "V" y "G" son la misma cosa nombrada de dos maneras.
//
// El disparador es un <button> real DENTRO del <td>, no el <td> con role="button":
// ese role sobrescribe el role="cell" implícito y deja la fila sin celdas para un
// lector de pantalla, perdiendo la lectura por columna. Como bonus, el <button>
// nativo trae Enter/Espacio y el gating por `disabled`, así que no hace falta
// handler de teclado ni condicionar los eventos por `active`.
function PlayableCell({
  role, active, onPlay, isPlaying, isDimmed, ariaLabel, className, activeClassName, cambia, children,
}: PlayableCellProps) {
  let cls = active ? activeClassName : className;
  if (active && isPlaying) cls = `${activeClassName} ${styles.cellPlaying}`;
  else if (active && isDimmed) cls = `${activeClassName} ${styles.cellDimmed}`;

  return (
    <td className={cls} data-harmonic={role} data-cambia={cambia || undefined}>
      <button
        type="button"
        className={styles.cellButton}
        disabled={!active}
        aria-label={ariaLabel}
        onClick={onPlay}
        onFocus={onPlay}
      >
        {children}
      </button>
    </td>
  );
}
