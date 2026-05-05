import SectionLabel from '../../../shared/SectionLabel';
import AcordesBuilder from '../../../primitives/AcordesBuilder/AcordesBuilder';
import {
  ACORDES_INTRO,
  ACORDES_DEFINICIONES,
  ACORDES_DIFF,
  ACORDES_NOMENCLATURA_INTRO,
  ACORDES_NOMENCLATURA,
  ACORDES_PROCEDIMIENTO_TITULO,
  ACORDES_PROCEDIMIENTO_PASOS,
  ACORDES_EJEMPLO_TITULO,
  ACORDES_EJEMPLO_PASOS,
  ACORDES_RESULTADO_MAYOR,
  ACORDES_RESULTADO_MENOR,
  ACORDES_PRIMITIVA_TITULO,
  ACORDES_PRIMITIVA_INSTRUCCION,
} from '../data/literalContent';
import styles from './AcordesSection.module.css';

export default function AcordesSection() {
  return (
    <section className={styles.section}>
      <SectionLabel text="07 · Acordes" />
      <h2>Acordes mayores y menores</h2>

      <p className={styles.text}>{ACORDES_INTRO}</p>

      <ul className={styles.defList}>
        {ACORDES_DEFINICIONES.map((d) => (
          <li key={d.tipo}>
            <strong>{d.tipo}</strong> = <span className={styles.formula}>{d.formula}</span> · {d.desc}
          </li>
        ))}
      </ul>

      <p className={styles.text}>{ACORDES_DIFF}</p>

      <h3 className={styles.subheading}>{ACORDES_NOMENCLATURA_INTRO}</h3>
      <ul className={styles.nomList}>
        {ACORDES_NOMENCLATURA.map((n) => (
          <li key={n.regla}>
            <strong>{n.regla}:</strong> {n.desc}
          </li>
        ))}
      </ul>

      <h3 className={styles.subheading}>{ACORDES_PROCEDIMIENTO_TITULO}</h3>
      <ol className={styles.steps}>
        {ACORDES_PROCEDIMIENTO_PASOS.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <h3 className={styles.subheading}>{ACORDES_EJEMPLO_TITULO}</h3>
      <ol className={styles.steps}>
        {ACORDES_EJEMPLO_PASOS.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <p className={styles.resultado}>{ACORDES_RESULTADO_MAYOR}</p>
      <p className={styles.text}>{ACORDES_RESULTADO_MENOR}</p>

      <h3 className={styles.subheading}>{ACORDES_PRIMITIVA_TITULO}</h3>
      <p className={styles.text}>{ACORDES_PRIMITIVA_INSTRUCCION}</p>
      <AcordesBuilder />
    </section>
  );
}
