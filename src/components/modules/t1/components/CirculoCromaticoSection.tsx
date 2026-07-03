import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import SectionLabel from "../../../shared/SectionLabel";
import RuleNote from "../../../shared/RuleNote";
import NoteToken from "../../../shared/NoteToken/NoteToken";
import Prose from "../../../shared/Prose/Prose";
import ChromaticCircleSection from "../../../primitives/ChromaticCircle/ChromaticCircleSection";
import { useUIStore } from "../../../../stores/useUIStore";
import { ALL } from "../../../../data/notes";
import { tonicChromatic } from "../../../../utils/noteCalculations";
import type { NoteSpelling } from "../../../../types/music";
import type { ProseSegment } from "../../../../types/prose";
import styles from "./CirculoCromaticoSection.module.css";

// Datos musicales (§1.2): las 12 notas del círculo cromático, no UI copy.
const CC_TABLA = [
  "A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab",
] as const;

function renderCcCell(cell: string) {
  const parts = cell.split("/") as NoteSpelling[];
  return parts.map((p, i) => (
    <Fragment key={i}>
      {i > 0 && "/"}
      <NoteToken note={p} />
    </Fragment>
  ));
}

export default function CirculoCromaticoSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const tonic = useUIStore((s) => s.tonic);
  const ccNoAlterada = t("t1.s03.rule", { returnObjects: true }) as ProseSegment;

  // Rotate CC_TABLA to start from the active tonic
  const rotatedCcTabla = useMemo(() => {
    const tonicIdx = ALL.indexOf(tonicChromatic(tonic));
    // CC_TABLA starts at A (index 9 in ALL), so offset is (tonicIdx - 9 + 12) % 12
    const offset = (tonicIdx - ALL.indexOf("A")) % 12;
    return Array.from(
      { length: 12 },
      (_, i) => CC_TABLA[(i - offset + 12) % 12],
    );
  }, [tonic]);

  return (
    <section id="s-circulo" className={styles.section}>
      <SectionLabel text={t("t1.s03.label")} />
      <h2>{t("t1.s03.title")}</h2>

      <p className={styles.text}>{t("t1.s03.intro")}</p>

      <ul className={styles.defs}>
        <li>{t("t1.s03.sharp_def")}</li>
        <li>{t("t1.s03.flat_def")}</li>
      </ul>

      <p className={styles.text}>{t("t1.s03.body")}</p>

      <div className={styles.ccStripWrap}>
        <ol
          className={styles.ccStrip}
          aria-label={
            locale === "de"
              ? "Die 12 Töne des chromatischen Kreises"
              : "Las 12 notas del círculo cromático"
          }
        >
          {rotatedCcTabla.map((n) => (
            <li key={n}>{renderCcCell(n)}</li>
          ))}
        </ol>
      </div>

      <RuleNote>
        <Prose segment={ccNoAlterada} />
      </RuleNote>

      <ChromaticCircleSection />
    </section>
  );
}
