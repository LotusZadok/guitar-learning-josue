import SectionLabel from '../../../shared/SectionLabel';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import Prose from '../../../shared/Prose/Prose';
import EscalaMayor from '../../../primitives/EscalaMayor/EscalaMayor';
import type { NoteSpelling } from '../../../../types/music';
import {
  ESCALA_DEF,
  ESCALA_EJEMPLO_INTRO,
  ESCALA_TABLA_HEAD,
  ESCALA_TABLA_NOTAS,
  ESCALA_TABLA_DIST,
  ESCALA_DIVISION_INTRO,
  ESCALA_ESTABLES,
  ESCALA_TENSAS,
  ESCALA_PRIMITIVA_TITULO,
  ESCALA_PRIMITIVA_INSTRUCCION,
} from '../data/literalContent';
import styles from './EscalaMayorSection.module.css';

export default function EscalaMayorSection() {
  return (
    <section className={styles.section}>
      <SectionLabel text="04 · Escala mayor" />
      <h2>Escala mayor: notas estables y tensas</h2>

      <p className={styles.text}>{ESCALA_DEF}</p>

      <p className={styles.text}><Prose segment={ESCALA_EJEMPLO_INTRO} /></p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {ESCALA_TABLA_HEAD.map((h, i) => (
                <th key={i} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {ESCALA_TABLA_NOTAS.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row">{c}</th>
                ) : (
                  <td key={i}><NoteToken note={c as NoteSpelling} /></td>
                ),
              )}
            </tr>
            <tr>
              {ESCALA_TABLA_DIST.map((c, i) =>
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

      <p className={styles.text}>{ESCALA_DIVISION_INTRO}</p>
      <ul className={styles.divList}>
        <li>{ESCALA_ESTABLES}</li>
        <li>{ESCALA_TENSAS}</li>
      </ul>

      <h3 className={styles.subheading}>{ESCALA_PRIMITIVA_TITULO}</h3>
      <p className={styles.text}>{ESCALA_PRIMITIVA_INSTRUCCION}</p>
      <EscalaMayor />
    </section>
  );
}
