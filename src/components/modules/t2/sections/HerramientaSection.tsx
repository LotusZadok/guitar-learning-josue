import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import {
  HERRAMIENTA_INTRO,
  HERRAMIENTA_NOTAS,
  HERRAMIENTA_SOSTENIDOS,
  HERRAMIENTA_BEMOLES,
  HERRAMIENTA_SOSTENIDOS_EXPLICACION,
  HERRAMIENTA_BEMOLES_EXPLICACION,
  PROPIEDAD_ESPECIFICO,
  PROPIEDAD_ACUMULATIVO,
  PROPIEDAD_MULTITONAL,
  CONSEJO_MEMORIZAR,
} from '../data/literalContent';
import styles from './HerramientaSection.module.css';

export default function HerramientaSection() {
  return (
    <section className={styles.section}>
      <SectionLabel text="02 — La herramienta" />
      <h2>F C G D A E B</h2>

      <p className={styles.text}>{HERRAMIENTA_INTRO}</p>

      {/* The Tool Box */}
      <div className={styles.toolBox}>
        <div className={styles.toolRow}>
          <span className={styles.rowLabel}>#</span>
          {HERRAMIENTA_SOSTENIDOS.map(n => (
            <span key={n} className={styles.noteSharp}>{n}</span>
          ))}
        </div>
        <div className={styles.toolRow}>
          <span className={styles.rowLabel}> </span>
          {HERRAMIENTA_NOTAS.map(n => (
            <span key={n} className={styles.noteNatural}>{n}</span>
          ))}
        </div>
        <div className={styles.toolRow}>
          <span className={styles.rowLabel}>b</span>
          {HERRAMIENTA_BEMOLES.map(n => (
            <span key={n} className={styles.noteFlat}>{n}</span>
          ))}
        </div>
      </div>

      <p className={styles.text}>{HERRAMIENTA_SOSTENIDOS_EXPLICACION}</p>
      <p className={styles.text}>{HERRAMIENTA_BEMOLES_EXPLICACION}</p>

      {/* Three property cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Específico</h3>
          <p className={styles.cardText}>{PROPIEDAD_ESPECIFICO}</p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Acumulativo</h3>
          <p className={styles.cardText}>{PROPIEDAD_ACUMULATIVO}</p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Multitonal</h3>
          <p className={styles.cardText}>{PROPIEDAD_MULTITONAL}</p>
        </div>
      </div>

      <RuleNote>
        <strong>{CONSEJO_MEMORIZAR}</strong>
      </RuleNote>
    </section>
  );
}
