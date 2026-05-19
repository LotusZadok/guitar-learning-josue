import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import ProgresionesArmonicas from '../../../primitives/ProgresionesArmonicas/ProgresionesArmonicas';
import { useUIStore } from '../../../../stores/useUIStore';
import {
  PROGRESIONES_INTRO,
  PROGRESIONES_PROCEDIMIENTO_TITULO,
  PROGRESIONES_PROCEDIMIENTO_PASOS,
  PROGRESIONES_PRIMITIVA_INSTRUCCION,
  PROGRESIONES_CONSEJO,
} from '../data/literalContent';
import styles from './ProgresionesArmonicasSection.module.css';

export default function ProgresionesArmonicasSection() {
  const tonalidad = useUIStore((s) => s.tonic);

  return (
    <section className={styles.section}>
      <SectionLabel text="4.8 · Progresiones armónicas" />
      <h2>Progresiones armónicas</h2>

      <p className={styles.text}>{PROGRESIONES_INTRO}</p>

      <h3 className={styles.subheading}>{PROGRESIONES_PROCEDIMIENTO_TITULO}</h3>
      <ol className={styles.pasos}>
        {PROGRESIONES_PROCEDIMIENTO_PASOS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>

      <p className={styles.text}>{PROGRESIONES_PRIMITIVA_INSTRUCCION}</p>

      <ProgresionesArmonicas tonalidad={tonalidad} />

      <RuleNote>{PROGRESIONES_CONSEJO}</RuleNote>
    </section>
  );
}
