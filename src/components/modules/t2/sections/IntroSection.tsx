import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import {
  INTRO_LENGUAS, INTRO_VARIEDAD,
  DEF_TONALIDADES, DEF_ARMADURA,
  REGLA_NO_MEZCLA, CONCLUSION_COHABITAN,
} from '../data/literalContent';
import styles from './IntroSection.module.css';

export default function IntroSection() {
  return (
    <section className={styles.section}>
      <SectionLabel text="01 · Introducción" />
      <h2>Tonalidades y Armaduras</h2>

      <p className={styles.text}>{INTRO_LENGUAS}</p>
      <p className={styles.text}>{INTRO_VARIEDAD}</p>

      <RuleNote>
        <strong>Tonalidades:</strong> {DEF_TONALIDADES}
      </RuleNote>

      <RuleNote>
        <strong>Armadura:</strong> {DEF_ARMADURA}
      </RuleNote>

      <RuleNote>
        <strong>Regla:</strong> {REGLA_NO_MEZCLA}
      </RuleNote>

      <p className={styles.conclusion}>{CONCLUSION_COHABITAN}</p>
    </section>
  );
}
