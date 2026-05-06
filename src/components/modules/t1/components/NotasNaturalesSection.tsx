import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import {
  NATURALES_INTRO,
  NATURALES_TABLA_ES,
  NATURALES_TABLA_EN,
  NATURALES_JERARQUIA,
  NATURALES_BASE,
  CONSEJO_NATURALES,
} from '../data/literalContent';
import styles from './NotasNaturalesSection.module.css';

export default function NotasNaturalesSection() {
  return (
    <section className={styles.section}>
      <SectionLabel text="01 · Notas naturales" />
      <h2>Notas naturales y cifrado anglosajón</h2>

      <p className={styles.text}>{NATURALES_INTRO}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {NATURALES_TABLA_ES.map((n) => (
                <th key={n} scope="col">{n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {NATURALES_TABLA_EN.map((n) => (
                <td key={n}><NoteToken note={n} /></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{NATURALES_JERARQUIA}</p>
      <p className={styles.text}>{NATURALES_BASE}</p>

      <RuleNote>{CONSEJO_NATURALES}</RuleNote>
    </section>
  );
}
