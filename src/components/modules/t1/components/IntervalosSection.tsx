import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import SectionLabel from "../../../shared/SectionLabel";
import Prose from "../../../shared/Prose/Prose";
import NoteToken from "../../../shared/NoteToken/NoteToken";
import IntervalsSection from "../../../primitives/Intervals/IntervalsSection";
import { useUIStore } from "../../../../stores/useUIStore";
import { ALL } from "../../../../data/notes";
import {
  majorScaleSpelled,
  tonicChromatic,
} from "../../../../utils/noteCalculations";
import type { NoteSpelling } from "../../../../types/music";
import type { ProseSegment, ProseFragment } from "../../../../types/prose";
import styles from "./IntervalosSection.module.css";

// Datos musicales (§1.3): los 13 intervalos dentro de una octava y sus
// semitonos (cifrados universales, no UI copy).
const INTERVALOS_13_CODES = [
  "T", "2m", "2M", "3m", "3M", "4J", "4a/5d", "5J", "6m", "6M", "7m", "7M", "8J",
] as const;
const INTERVALOS_13_SEMIS = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
] as const;

// ── Dynamic interval-procedure builders ─────────────────────────────────────
// These replace the hardcoded G exports. Each function returns a ProseSegment
// (or a step array) derived from the active tonic.

const NATURAL_LETTERS_7 = ["C", "D", "E", "F", "G", "A", "B"] as const;
const SHARP_TO_FLAT_ASCII: Record<string, string> = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb",
};
// Letter offset for each of the 13 interval positions (0–12 semitones).
// Position 6 = tritone: rendered with both adjacent letters (handled separately).
const LETTER_OFFSETS_13 = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 0] as const;

function buildTitulo(tonicAscii: string, locale: string): ProseSegment {
  const text =
    locale === "de"
      ? "Verfahren zum Finden der Intervalle ausgehend von der Tonika "
      : "Procedimiento para encontrar los intervalos partiendo de una tónica ";
  return [
    { type: "text", value: text },
    { type: "note", value: tonicAscii as NoteSpelling },
  ];
}

// Reunión 24/5/26: el prefijo de texto y la lista de notas van en líneas separadas.
// Devolvemos un tuple [prefix, notes] que el render coloca con <br/> entre medio.
type StepWithBreak = { prefix: ProseSegment; notes: ProseSegment };

function buildStep1(letterIdx: number, locale: string): StepWithBreak {
  const prefix: ProseSegment = [
    {
      type: "text",
      value:
        locale === "de"
          ? "Die Buchstaben nach der Intervallnummer aufschreiben (Alterierungen ignorieren):"
          : "Escribir las letras según el número del intervalo (ignorando alteraciones):",
    },
  ];
  const notes: ProseFragment[] = [];
  for (let i = 0; i <= 12; i++) {
    if (i === 6) {
      const l3 = NATURAL_LETTERS_7[(letterIdx + 3) % 7];
      const l4 = NATURAL_LETTERS_7[(letterIdx + 4) % 7];
      notes.push(
        { type: "note", value: l3 },
        { type: "text", value: "-" },
        { type: "note", value: l4 },
      );
    } else {
      const letter = NATURAL_LETTERS_7[(letterIdx + LETTER_OFFSETS_13[i]) % 7];
      notes.push({ type: "note", value: letter });
    }
    notes.push({ type: "text", value: i < 12 ? " " : "." });
  }
  return { prefix, notes };
}

function buildStep2(tonicIdx: number, locale: string): StepWithBreak {
  const prefix: ProseSegment = [
    {
      type: "text",
      value:
        locale === "de"
          ? "Den chromatischen Kreis ab der Tonika aufschreiben:"
          : "Escribir el círculo cromático desde la tónica:",
    },
  ];
  const notes: ProseFragment[] = [];
  for (let i = 0; i <= 12; i++) {
    const note = ALL[(tonicIdx + i) % 12];
    const flat = SHARP_TO_FLAT_ASCII[note];
    if (flat) {
      notes.push(
        { type: "note", value: note },
        { type: "text", value: "/" },
        { type: "note", value: flat as NoteSpelling },
      );
    } else {
      notes.push({ type: "note", value: note });
    }
    notes.push({ type: "text", value: i < 12 ? " " : "." });
  }
  return { prefix, notes };
}

// Las 13 notas del resultado como spellings ASCII para la tabla comparativa
// (1.3): cada columna es un intervalo, cada celda su(s) nota(s) — el tritono
// es la única celda con dos grafías (ambas tokenizadas, separadas por " / ").
// Reunión 9/6/26: el párrafo "Resultado para X: ..." se eliminó; la tabla es
// el único resultado.
function buildResultadoCells(
  tonicIdx: number,
  letterIdx: number,
): NoteSpelling[][] {
  const cells: NoteSpelling[][] = [];
  for (let i = 0; i <= 12; i++) {
    const note = ALL[(tonicIdx + i) % 12];
    const flat = SHARP_TO_FLAT_ASCII[note];
    if (flat && i === 6) {
      // Tritone always shows both enharmonic spellings
      cells.push([note, flat as NoteSpelling]);
    } else if (flat) {
      const expected =
        NATURAL_LETTERS_7[(letterIdx + LETTER_OFFSETS_13[i]) % 7];
      cells.push([flat[0] === expected ? (flat as NoteSpelling) : note]);
    } else {
      cells.push([note]);
    }
  }
  return cells;
}

function buildOctava(tonicAscii: string, locale: string): ProseSegment {
  const t = tonicAscii as NoteSpelling;
  if (locale === "de") {
    return [
      {
        type: "text",
        value:
          "Die reine Oktave (8r) ist derselbe Ton eine Oktave höher oder tiefer. Die 8r von ",
      },
      { type: "note", value: t },
      { type: "text", value: " ist " },
      { type: "note", value: t },
      { type: "text", value: "." },
    ];
  }
  return [
    {
      type: "text",
      value:
        "La 8J (octava justa) es la misma nota más aguda o más grave. La 8J de ",
    },
    { type: "note", value: t },
    { type: "text", value: " es " },
    { type: "note", value: t },
    { type: "text", value: "." },
  ];
}

const GRADE_LABELS = ["T", "2", "3", "4", "5", "6", "7"] as const;

function renderStep(step: string | ProseSegment | StepWithBreak) {
  if (typeof step === "string") return step;
  if ("prefix" in step && "notes" in step) {
    return (
      <>
        <Prose segment={step.prefix} />
        <br />
        <Prose segment={step.notes} />
      </>
    );
  }
  return <Prose segment={step} />;
}

export default function IntervalosSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const tonic = useUIStore((s) => s.tonic);
  const spelledScale = useMemo(() => majorScaleSpelled(tonic), [tonic]);

  // tonicAscii: ASCII form of spelled tonic (e.g. 'Bb' for A#, 'G' for G).
  const tonicAscii = useMemo(
    () => spelledScale[0].replace("♯", "#").replace("♭", "b"),
    [spelledScale],
  );
  const tonicLetterIdx = useMemo(
    () =>
      NATURAL_LETTERS_7.indexOf(
        tonicAscii[0] as (typeof NATURAL_LETTERS_7)[number],
      ),
    [tonicAscii],
  );
  const tonicIdx = useMemo(() => ALL.indexOf(tonicChromatic(tonic)), [tonic]);
  // letter-rule explanation (generic, keeps B/Bb example) + closing step.
  const letterRule = t("t1.s04.step_letter_rule", {
    returnObjects: true,
  }) as ProseSegment;
  const stepUpdate = t("t1.s04.step_update");

  const procedimientoTitulo = useMemo(
    () => buildTitulo(tonicAscii, locale),
    [tonicAscii, locale],
  );
  const procedimientoPasos = useMemo(
    () => [
      buildStep1(tonicLetterIdx, locale),
      buildStep2(tonicIdx, locale),
      letterRule,
      stepUpdate,
    ],
    [tonicLetterIdx, tonicIdx, locale, letterRule, stepUpdate],
  );
  const resultadoCells = useMemo(
    () => buildResultadoCells(tonicIdx, tonicLetterIdx),
    [tonicIdx, tonicLetterIdx],
  );
  const octava = useMemo(
    () => buildOctava(tonicAscii, locale),
    [tonicAscii, locale],
  );

  return (
    <section id="s-intervalos" className={styles.section}>
      <SectionLabel text={t("t1.s04.label")} />
      <h2>{t("t1.s04.title")}</h2>

      <p className={styles.text}>{t("t1.s04.intro")}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {GRADE_LABELS.map((g) => (
                <th key={g} scope="col">
                  {g}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Reunión 9/6/26: solo letras naturales. A esta altura del método
                  aún no se explicó por qué algunas notas llevan ♯/♭. */}
              {spelledScale.map((n, i) => (
                <td key={i}>{n[0]}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{t("t1.s04.quality_intro")}</p>

      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.tableIntervals}`}>
          <thead>
            <tr>
              <th scope="col">{t("t1.s04.table_headers.name")}</th>
              {INTERVALOS_13_CODES.map((h, i) => (
                <th key={i} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{t("t1.s04.table_headers.semitone")}</th>
              {INTERVALOS_13_SEMIS.map((c, i) => (
                <td key={i}>{c}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className={styles.subheading}>
        <Prose segment={procedimientoTitulo} />
      </h3>
      <ol className={styles.steps}>
        {procedimientoPasos.map((p, i) => (
          <li key={i}>{renderStep(p)}</li>
        ))}
      </ol>

      {/* Tabla comparativa (1.3): qué intervalo es cada nota del resultado. */}
      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.tableIntervals}`}>
          <thead>
            <tr>
              <th scope="col">{t("t1.s04.table_headers.name")}</th>
              {INTERVALOS_13_CODES.map((h, i) => (
                <th key={i} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{locale === "de" ? "Ergebnis" : "Resultado"}</th>
              {resultadoCells.map((spellings, i) => (
                <td key={i}>
                  {spellings.map((s, j) => (
                    <Fragment key={j}>
                      {j > 0 && " / "}
                      <NoteToken note={s} />
                    </Fragment>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.text}>
        <Prose segment={octava} />
      </p>

      <IntervalsSection />
    </section>
  );
}
