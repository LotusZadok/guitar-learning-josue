import SectionLabel from '../../../shared/SectionLabel';
import IntervalsSection from '../../../primitives/Intervals/IntervalsSection';
import {
  INTERVALOS_DEF,
  INTERVALOS_GRADOS_HEAD,
  INTERVALOS_GRADOS_ROW,
  INTERVALOS_CALIDAD,
  INTERVALOS_13_HEAD,
  INTERVALOS_13_ROW,
  INTERVALOS_PROCEDIMIENTO_TITULO,
  INTERVALOS_PROCEDIMIENTO_PASOS,
  INTERVALOS_RESULTADO_G,
  INTERVALOS_OCTAVA,
} from '../data/literalContent';
import styles from './IntervalosSection.module.css';

export default function IntervalosSection() {
  return (
    <section className={styles.section}>
      <SectionLabel text="03 · Intervalos" />
      <h2>Los 13 intervalos posibles dentro de una octava</h2>

      <p className={styles.text}>{INTERVALOS_DEF}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {INTERVALOS_GRADOS_HEAD.map((h, i) => (
                <th key={i} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {INTERVALOS_GRADOS_ROW.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row">{c}</th>
                ) : (
                  <td key={i}>{c}</td>
                ),
              )}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{INTERVALOS_CALIDAD}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {INTERVALOS_13_HEAD.map((h, i) => (
                <th key={i} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {INTERVALOS_13_ROW.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row">{c}</th>
                ) : (
                  <td key={i}>{c}</td>
                ),
              )}
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className={styles.subheading}>{INTERVALOS_PROCEDIMIENTO_TITULO}</h3>
      <ol className={styles.steps}>
        {INTERVALOS_PROCEDIMIENTO_PASOS.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <p className={styles.resultado}>{INTERVALOS_RESULTADO_G}</p>
      <p className={styles.text}>{INTERVALOS_OCTAVA}</p>

      <IntervalsSection />
    </section>
  );
}
