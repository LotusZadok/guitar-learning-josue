import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import TriadsSection from '../../../primitives/Triads/TriadsSection';
import {
  TRIADAS_DEF,
  TRIADAS_NOTAS,
  TRIADAS_PROCEDIMIENTO_TITULO,
  TRIADAS_PROCEDIMIENTO_PASOS,
  TRIADAS_EJEMPLO,
  TRIADAS_INTRO_TABLA,
  TRIADAS_TABLA_HEAD,
  TRIADAS_TABLA_ROW,
  TRIADAS_MAESTRA,
  CONSEJO_TRIADAS,
} from '../data/literalContent';
import styles from './TriadasSection.module.css';

export default function TriadasSection() {
  return (
    <section className={styles.section}>
      <SectionLabel text="06 · Tríadas" />
      <h2>Construcción de las 7 tríadas y la tríada maestra</h2>

      <p className={styles.text}>{TRIADAS_DEF}</p>

      <ul className={styles.notas}>
        {TRIADAS_NOTAS.map((n) => (
          <li key={n.nombre}>
            <strong>{n.nombre}:</strong> {n.desc}
          </li>
        ))}
      </ul>

      <h3 className={styles.subheading}>{TRIADAS_PROCEDIMIENTO_TITULO}</h3>
      <ol className={styles.steps}>
        {TRIADAS_PROCEDIMIENTO_PASOS.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <p className={styles.ejemplo}>{TRIADAS_EJEMPLO}</p>

      <p className={styles.text}>{TRIADAS_INTRO_TABLA}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {TRIADAS_TABLA_HEAD.map((h) => (
                <th key={h} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {TRIADAS_TABLA_ROW.map((c, i) => (
                <td key={i}>{c}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.maestra}>{TRIADAS_MAESTRA}</p>

      <RuleNote>{CONSEJO_TRIADAS}</RuleNote>

      <TriadsSection />
    </section>
  );
}
