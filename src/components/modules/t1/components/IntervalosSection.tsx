import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import SectionLabel from "../../../shared/SectionLabel";
import Prose from "../../../shared/Prose/Prose";
import NoteToken from "../../../shared/NoteToken/NoteToken";
import IntervalsSection from "../../../primitives/Intervals/IntervalsSection";
import { useUIStore } from "../../../../stores/useUIStore";
import {
  aAscii,
  majorScaleSpelled,
  octavasDesdeRaiz,
  filasDeIntervalos,
} from "../../../../utils/noteCalculations";
import { conOctavas, notasDe } from "../../../../utils/prose";
import type { NoteSpelling, Tonic } from "../../../../types/music";
import type { ProseSegment } from "../../../../types/prose";
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

// Reunión 22/11/26 (#7): las notas de los pasos 1 y 2 dejan el párrafo y pasan a
// filas de la tabla de intervalos, alineadas con T…8J (supera la decisión del
// 24/5/26 de poner el prefijo y la lista en líneas separadas).
function textoPaso(paso: 1 | 2, locale: string): string {
  if (paso === 1) {
    return locale === "de"
      ? "Die Buchstaben nach der Intervallnummer aufschreiben (Alterierungen ignorieren)."
      : "Escribir las letras según el número del intervalo (ignorando alteraciones).";
  }
  return locale === "de"
    ? "Den chromatischen Kreis ab der Tonika aufschreiben."
    : "Escribir el círculo cromático desde la tónica.";
}

// #12 y #15: la prosa de la 8J sube desde la tónica.
function anclarDesdeRaiz(tonic: Tonic, segment: ProseSegment): ProseSegment {
  return conOctavas(segment, octavasDesdeRaiz(tonic, notasDe(segment)));
}

function renderNotas(grafias: NoteSpelling[], octave: number) {
  return grafias.map((g, j) => (
    <Fragment key={g}>
      {j > 0 && " / "}
      <NoteToken note={g} octave={octave} />
    </Fragment>
  ));
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

function renderStep(step: string | ProseSegment) {
  if (typeof step === "string") return step;
  return <Prose segment={step} />;
}

export default function IntervalosSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const tonic = useUIStore((s) => s.tonic);
  const spelledScale = useMemo(() => majorScaleSpelled(tonic), [tonic]);

  // tonicAscii: ASCII form of spelled tonic (e.g. 'Bb' for A#, 'G' for G).
  const tonicAscii = useMemo(
    () => aAscii(spelledScale[0]),
    [spelledScale],
  );
  const filas = useMemo(() => filasDeIntervalos(tonic), [tonic]);
  // Octava de cada una de las 13 posiciones cromáticas desde la tónica (T…8J).
  const octavasCromaticas = useMemo(
    () => octavasDesdeRaiz(tonic, filas.cromatico.map((c) => c[0])),
    [tonic, filas],
  );
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
    () => [textoPaso(1, locale), textoPaso(2, locale), letterRule, stepUpdate],
    [locale, letterRule, stepUpdate],
  );
  const octava = useMemo(
    () => anclarDesdeRaiz(tonic, buildOctava(tonicAscii, locale)),
    [tonic, tonicAscii, locale],
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
            {/* Paso 1: letras como texto plano. Una letra natural como NoteToken
                sonaría y se colorearía como otra nota (DESIGN §5, excepción 1). */}
            <tr>
              <th scope="row">{locale === "de" ? "Schritt 1" : "Paso 1"}</th>
              {filas.letras.map((l, i) => (
                <td key={i}>{l}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">{locale === "de" ? "Schritt 2" : "Paso 2"}</th>
              {filas.cromatico.map((grafias, i) => (
                <td key={i}>{renderNotas(grafias, octavasCromaticas[i])}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">{locale === "de" ? "Ergebnis" : "Resultado"}</th>
              {filas.resultado.map((grafias, i) => (
                <td key={i}>{renderNotas(grafias, octavasCromaticas[i])}</td>
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
