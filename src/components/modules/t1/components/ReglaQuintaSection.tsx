import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import Prose from '../../../shared/Prose/Prose';
import CirculoDeQuintas from '../../../primitives/CirculoDeQuintas/CirculoDeQuintas';
import {
  REGLA_BULLETS,
  REGLA_BULLETS_DE,
  REGLA_EXCEPCION_B,
  REGLA_EXCEPCION_B_DE,
  REGLA_EXCEPCION_BB,
  REGLA_EXCEPCION_BB_DE,
  REGLA_PRIMITIVA_TITULO,
  REGLA_PRIMITIVA_INSTRUCCION,
  REGLA_PRIMITIVA_INSTRUCCION_DE,
  REGLA_NOTA_BEMOLES,
  REGLA_NOTA_BEMOLES_DE,
} from '../data/literalContent';
import styles from './ReglaQuintaSection.module.css';

export default function ReglaQuintaSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const bullets = locale === 'de' ? REGLA_BULLETS_DE : REGLA_BULLETS;
  const excepcionB = locale === 'de' ? REGLA_EXCEPCION_B_DE : REGLA_EXCEPCION_B;
  const excepcionBb = locale === 'de' ? REGLA_EXCEPCION_BB_DE : REGLA_EXCEPCION_BB;
  const primitiva = locale === 'de' ? REGLA_PRIMITIVA_INSTRUCCION_DE : REGLA_PRIMITIVA_INSTRUCCION;
  const notaBemoles = locale === 'de' ? REGLA_NOTA_BEMOLES_DE : REGLA_NOTA_BEMOLES;

  return (
    <section id="s-quinta" className={styles.section}>
      <SectionLabel text={t('t1.s08.label')} />
      <h2>{t('t1.s08.title')}</h2>

      <p className={styles.text}>{t('t1.s08.intro')}</p>

      <ul className={styles.bullets}>
        {bullets.map((b, i) => (
          <li key={i}>
            <strong>{b.regla}</strong> · {b.desc}{' '}
            <span className={styles.ejemplo}>{locale === 'de' ? 'Beispiel' : 'Ejemplo'}: <Prose segment={b.ejemplo} /></span>
          </li>
        ))}
      </ul>

      <h3 className={styles.subheading}>{locale === 'de' ? 'Ausnahmen' : 'Excepciones'}</h3>
      <ul className={styles.bullets}>
        <li><Prose segment={excepcionB} /></li>
        <li><Prose segment={excepcionBb} /></li>
      </ul>

      <h3 className={styles.subheading}>{locale === 'de' ? 'Die 12 reinen Quinten' : REGLA_PRIMITIVA_TITULO}</h3>
      <p className={styles.text}><Prose segment={primitiva} /></p>
      <CirculoDeQuintas />

      <p className={styles.footnote}><Prose segment={notaBemoles} /></p>

      <RuleNote>{t('t1.s08.tip')}</RuleNote>
    </section>
  );
}
