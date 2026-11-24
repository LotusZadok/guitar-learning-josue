import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import SectionLabel from "../../../shared/SectionLabel";
import RuleNote from "../../../shared/RuleNote";
import NoteToken from "../../../shared/NoteToken/NoteToken";
import Prose from "../../../shared/Prose/Prose";
import ChromaticCircleSection from "../../../primitives/ChromaticCircle/ChromaticCircleSection";
import { useUIStore } from "../../../../stores/useUIStore";
import { tablaCromaticaDesdeTonica } from "../../../../utils/noteCalculations";
import type { NoteSpelling } from "../../../../types/music";
import type { ProseSegment } from "../../../../types/prose";
import styles from "./CirculoCromaticoSection.module.css";

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

  const rotatedCcTabla = useMemo(() => tablaCromaticaDesdeTonica(tonic), [tonic]);

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
