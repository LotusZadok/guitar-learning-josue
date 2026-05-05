import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import ChromaticCircleSection from '../../../primitives/ChromaticCircle/ChromaticCircleSection';
import {
  ALTERADAS_INTRO,
  ALTERADAS_DEFS,
  CC_INTRO,
  CC_TABLA,
  CC_NO_ALTERADA,
} from '../data/literalContent';
import styles from './CirculoCromaticoSection.module.css';

export default function CirculoCromaticoSection() {
  return (
    <section className={styles.section}>
      <SectionLabel text="02 · Círculo cromático" />
      <h2>Notas alteradas y círculo cromático</h2>

      <p className={styles.text}>{ALTERADAS_INTRO}</p>

      <ul className={styles.defs}>
        {ALTERADAS_DEFS.map((d) => (
          <li key={d.simbolo}>
            <strong>{d.nombre} ({d.simbolo})</strong> {d.desc}
          </li>
        ))}
      </ul>

      <p className={styles.text}>{CC_INTRO}</p>

      <div className={styles.ccStripWrap}>
        <ol className={styles.ccStrip} aria-label="Las 12 notas del círculo cromático">
          {CC_TABLA.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ol>
      </div>

      <RuleNote>{CC_NO_ALTERADA}</RuleNote>

      <ChromaticCircleSection />
    </section>
  );
}
