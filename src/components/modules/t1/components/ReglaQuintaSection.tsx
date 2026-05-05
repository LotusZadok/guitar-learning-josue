import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import ReglaQuinta from '../../../primitives/ReglaQuinta/ReglaQuinta';
import {
  REGLA_INTRO,
  REGLA_BULLETS,
  REGLA_EXCEPCIONES_TITULO,
  REGLA_EXCEPCION_B,
  REGLA_EXCEPCION_BB,
  CONSEJO_REGLA_5J,
  REGLA_PRIMITIVA_TITULO,
  REGLA_PRIMITIVA_INSTRUCCION,
  REGLA_NOTA_BEMOLES,
} from '../data/literalContent';
import styles from './ReglaQuintaSection.module.css';

export default function ReglaQuintaSection() {
  return (
    <section className={styles.section}>
      <SectionLabel text="08 · Regla de la 5J" />
      <h2>Regla de la quinta justa con sus excepciones</h2>

      <p className={styles.text}>{REGLA_INTRO}</p>

      <ul className={styles.bullets}>
        {REGLA_BULLETS.map((b, i) => (
          <li key={i}>
            <strong>{b.regla}</strong> · {b.desc} <span className={styles.ejemplo}>Ejemplo: {b.ejemplo}</span>
          </li>
        ))}
      </ul>

      <h3 className={styles.subheading}>{REGLA_EXCEPCIONES_TITULO}</h3>
      <ul className={styles.bullets}>
        <li>{REGLA_EXCEPCION_B}</li>
        <li>{REGLA_EXCEPCION_BB}</li>
      </ul>

      <h3 className={styles.subheading}>{REGLA_PRIMITIVA_TITULO}</h3>
      <p className={styles.text}>{REGLA_PRIMITIVA_INSTRUCCION}</p>
      <ReglaQuinta />

      <p className={styles.footnote}>{REGLA_NOTA_BEMOLES}</p>

      <RuleNote>{CONSEJO_REGLA_5J}</RuleNote>
    </section>
  );
}
