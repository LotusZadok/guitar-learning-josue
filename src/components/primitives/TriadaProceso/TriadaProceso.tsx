import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAudioEngine, stopAllNotes } from "../../../hooks/useAudioEngine";
import { useUIStore } from "../../../stores/useUIStore";
import { NATURALS, NOTE_COLORS, NOTE_ES } from "../../../data/notes";
import { spelledSequenceAscending } from "../../../utils/noteCalculations";
// Reutiliza la máquina de pasos de los procesos de §2.3/§2.4 (lógica pura,
// respeta prefers-reduced-motion). Misma "onda" que pidió el método.
import { useProcessAnimation } from "../../modules/t2/hooks/useProcessAnimation";
import ProcessControls from "../../shared/ProcessControls/ProcessControls";
import type { NaturalNote } from "../../../types/music";
import chrome from "../../shared/processChrome.module.css";
import styles from "./TriadaProceso.module.css";

const NOTE_DE: Record<NaturalNote, string> = {
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  A: "A",
  B: "H",
};

// 5 nodos: tónica → 2ª → 3ª → 4ª → 5ª. Tomadas las pares (0,2,4), saltadas las
// impares (1,3). 6 pasos = 5 nodos revelados uno a uno + el resultado (la tríada).
const TAKEN_IDX = new Set([0, 2, 4]);
const TOTAL_STEPS = 6;

const SVG_W = 480;
const SVG_H = 168;
const PAD_X = 44;
const STEP_X = (SVG_W - 2 * PAD_X) / 4;
const NODE_Y = 96;
// Subido respecto a los nodos para no traslapar las etiquetas de nota
// (noteName) que aparecen sobre el círculo de la raíz y la quinta.
const BRACKET_Y = NODE_Y - 64;
const BRACKET_BOTTOM = NODE_Y - 46;

function nodeX(i: number): number {
  return PAD_X + i * STEP_X;
}

interface StepLine {
  text: string;
  kind: "take" | "skip" | "result";
}

export default function TriadaProceso() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === "de";
  const tonic = useUIStore((s) => s.tonic);
  // El método construye la tríada con letras naturales (las alteraciones llegan
  // en §1.7/§2.6). Tomamos la letra natural de la tónica activa.
  const root = tonic[0] as NaturalNote;
  const { playNote } = useAudioEngine();
  const anim = useProcessAnimation(TOTAL_STEPS);
  const lastAudioStep = useRef(0);

  const notes = useMemo(() => {
    const i = NATURALS.indexOf(root);
    return Array.from(
      { length: 5 },
      (_, k) => NATURALS[(i + k) % 7] as NaturalNote,
    );
  }, [root]);

  // Notas tomadas (raíz, 3ra, 5ta) con octavas ascendentes: la tónica es la más
  // grave y cada una sube (principio "tónica = nota más grave").
  const takenAsc = useMemo(
    () => spelledSequenceAscending([notes[0], notes[2], notes[4]], 4),
    [notes],
  );
  // Refs para leer los valores más recientes sin que su cambio de referencia
  // (p. ej. takenAsc al cambiar la tónica) dispare el efecto de audio de abajo:
  // ese efecto solo debe sonar cuando cambia el número de paso, no cuando
  // cambia takenAsc por otro motivo (evita re-disparos con currentStep stale).
  const takenAscRef = useRef(takenAsc);
  const playNoteRef = useRef(playNote);
  takenAscRef.current = takenAsc;
  playNoteRef.current = playNote;

  const steps = useMemo<StepLine[]>(() => {
    const n = (i: number) =>
      isDe ? NOTE_DE[notes[i]] : `${NOTE_ES[notes[i]]} (${notes[i]})`;
    if (isDe) {
      return [
        { kind: "take", text: `Nehme ${n(0)} · Tonika` },
        { kind: "skip", text: `Überspringe ${n(1)}` },
        { kind: "take", text: `Nehme ${n(2)} · Terz` },
        { kind: "skip", text: `Überspringe ${n(3)}` },
        { kind: "take", text: `Nehme ${n(4)} · Quinte` },
        {
          kind: "result",
          text: `Ergebnis: ${NOTE_DE[notes[0]]} ${NOTE_DE[notes[2]]} ${NOTE_DE[notes[4]]} · der Dreiklang`,
        },
      ];
    }
    return [
      { kind: "take", text: `Tomo ${n(0)} · tónica` },
      { kind: "skip", text: `Salto ${n(1)}` },
      { kind: "take", text: `Tomo ${n(2)} · tercera` },
      { kind: "skip", text: `Salto ${n(3)}` },
      { kind: "take", text: `Tomo ${n(4)} · quinta` },
      {
        kind: "result",
        text: `Resultado: ${notes[0]} ${notes[2]} ${notes[4]} · la tríada`,
      },
    ];
  }, [notes, isDe]);

  // Reinicia al cambiar la tónica.
  useEffect(() => {
    anim.reset();
    lastAudioStep.current = 0;
    stopAllNotes();
  }, [root]); // eslint-disable-line react-hooks/exhaustive-deps

  // Audio atado al paso visible (nunca audio sin estado visual paralelo).
  // Pasos 1/3/5 suenan la nota tomada; el paso 6 suena la tríada en bloque
  // (traslape deliberado: es un acorde).
  useEffect(() => {
    const s = anim.currentStep;
    // Volver a 0 (◀ hasta el inicio, o reset por tónica) rearma el ref: si no,
    // el paso 1 se ilumina mudo al re-entrar.
    if (s === 0) {
      lastAudioStep.current = 0;
      return;
    }
    if (s === lastAudioStep.current) return;
    lastAudioStep.current = s;
    const ta = takenAscRef.current;
    const pn = playNoteRef.current;
    if (s === 1) pn(ta[0].name, ta[0].octave, 1.6);
    else if (s === 3) pn(ta[1].name, ta[1].octave, 1.6);
    else if (s === 5) pn(ta[2].name, ta[2].octave, 1.6);
    else if (s === 6) ta.forEach((nt) => pn(nt.name, nt.octave, 2.2));
  }, [anim.currentStep]);

  const current = anim.currentStep;
  const isResult = current >= TOTAL_STEPS;

  return (
    <div className={chrome.wrap}>
      <span className={chrome.eyebrow}>
        {isDe
          ? "Eine nehmen, die nächste überspringen"
          : "Tomo una, salto la siguiente"}
      </span>

      <div className={styles.layout}>
        {/* Tira de notas */}
        <svg
          className={styles.svg}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          role="img"
          aria-label={
            isDe
              ? `Aufbau des Dreiklangs von ${NOTE_DE[root]}`
              : `Construcción de la tríada de ${NOTE_ES[root]}`
          }
        >
          <line
            x1={PAD_X}
            y1={NODE_Y}
            x2={SVG_W - PAD_X}
            y2={NODE_Y}
            className={styles.baseline}
          />

          {/* Bracket que ata la tríada (raíz · 3ra · 5ta) al llegar al resultado */}
          <path
            d={`M ${nodeX(0)} ${BRACKET_BOTTOM} L ${nodeX(0)} ${BRACKET_Y} L ${nodeX(4)} ${BRACKET_Y} L ${nodeX(4)} ${BRACKET_BOTTOM}`}
            className={styles.bracket}
            style={{ opacity: isResult ? 1 : 0 }}
            fill="none"
          />
          <line
            x1={nodeX(2)}
            y1={BRACKET_Y}
            x2={nodeX(2)}
            y2={BRACKET_BOTTOM}
            className={styles.bracket}
            style={{ opacity: isResult ? 1 : 0 }}
          />
          <text
            x={nodeX(2)}
            y={BRACKET_Y - 8}
            className={styles.bracketLabel}
            style={{ opacity: isResult ? 1 : 0 }}
          >
            {isDe ? "DREIKLANG" : "TRÍADA"}
          </text>

          {notes.map((note, i) => {
            const revealed = current >= i + 1;
            const taken = TAKEN_IDX.has(i);
            const cx = nodeX(i);
            const isRoot = i === 0;
            const radius = isRoot ? 22 : taken ? 18 : 15;

            // pendiente · tomada · saltada (color de nota = uso canónico; el rol
            // se discrimina por opacity + tamaño + anillo + tachado, no por hue falso).
            let fill = "var(--surface-2)";
            let opacity = 0.5;
            let stroke = "var(--rule)";
            let strokeWidth = 1;
            let letterClass = styles.letterPending;
            if (revealed && taken) {
              fill = NOTE_COLORS[note];
              opacity = 1;
              stroke = isRoot ? "var(--paper)" : "none";
              strokeWidth = isRoot ? 2 : 0;
              letterClass = isRoot
                ? styles.letterTakenLarge
                : styles.letterTaken;
            } else if (revealed && !taken) {
              fill = NOTE_COLORS[note];
              opacity = 0.22;
              stroke = "none";
              strokeWidth = 0;
              letterClass = styles.letterSkipped;
            }

            return (
              <g key={i} className={styles.node}>
                <text
                  x={cx}
                  y={NODE_Y - radius - 14}
                  className={styles.noteName}
                >
                  {isDe ? NOTE_DE[note] : note}
                </text>
                <circle
                  cx={cx}
                  cy={NODE_Y}
                  r={radius}
                  fill={fill}
                  opacity={opacity}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
                {/* Tachado de "salto" sobre las notas omitidas */}
                {revealed && !taken && (
                  <line
                    x1={cx - radius}
                    y1={NODE_Y - radius}
                    x2={cx + radius}
                    y2={NODE_Y + radius}
                    className={styles.skipSlash}
                  />
                )}
                <text x={cx} y={NODE_Y + 1} className={letterClass}>
                  {isDe ? NOTE_DE[note] : note}
                </text>
                <text
                  x={cx}
                  y={NODE_Y + radius + 20}
                  className={styles.roleLabel}
                >
                  {revealed
                    ? taken
                      ? isRoot
                        ? "T"
                        : i === 2
                          ? "3"
                          : "5"
                      : isDe
                        ? "×"
                        : "×"
                    : ""}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Panel de pasos */}
        <ol className={chrome.steps}>
          {steps.map((step, i) => {
            const stepNum = i + 1;
            const active = stepNum === current;
            const past = stepNum < current;
            return (
              <li
                key={i}
                className={`${chrome.step} ${active ? chrome.stepActive : ""} ${past ? chrome.stepPast : ""} ${step.kind === "result" ? chrome.stepResult : ""}`}
                aria-current={active ? "step" : undefined}
              >
                <span className={chrome.stepNum}>{stepNum}</span>
                {step.text}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Controles del proceso */}
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
