import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import Prose from '../../../shared/Prose/Prose';
import TensionResolucion from '../../../primitives/TensionResolucion/TensionResolucion';
import {
  TENSION_INTRO,
  TENSION_REGLAS,
  CONSEJO_TENSION,
  TENSION_PRIMITIVA_TITULO,
  TENSION_PRIMITIVA_INSTRUCCION,
} from '../data/literalContent';
import styles from './TensionResolucionSection.module.css';

export default function TensionResolucionSection() {
  return (
    <section className={styles.section}>
      <SectionLabel text="05 · Tensión y resolución" />
      <h2>Tensión y resolución</h2>

      <p className={styles.text}>{TENSION_INTRO}</p>

      <ol className={styles.reglas}>
        {TENSION_REGLAS.map((r) => (
          <li key={r.titulo}>
            <span className={styles.reglaTitulo}>{r.titulo}</span> · <Prose segment={r.cuerpo} />
          </li>
        ))}
      </ol>

      <h3 className={styles.subheading}>{TENSION_PRIMITIVA_TITULO}</h3>
      <p className={styles.text}>{TENSION_PRIMITIVA_INSTRUCCION}</p>
      <TensionResolucion />

      <RuleNote>{CONSEJO_TENSION}</RuleNote>
    </section>
  );
}
