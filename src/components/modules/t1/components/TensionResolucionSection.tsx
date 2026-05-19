import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import Prose from '../../../shared/Prose/Prose';
import TensionResolucion from '../../../primitives/TensionResolucion/TensionResolucion';
import {
  TENSION_REGLAS,
  TENSION_REGLAS_DE,
  TENSION_PRIMITIVA_TITULO,
  TENSION_PRIMITIVA_INSTRUCCION,
} from '../data/literalContent';
import styles from './TensionResolucionSection.module.css';

export default function TensionResolucionSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const reglas = locale === 'de' ? TENSION_REGLAS_DE : TENSION_REGLAS;

  return (
    <section className={styles.section}>
      <SectionLabel text={t('t1.s05.label')} />
      <h2>{t('t1.s05.title')}</h2>

      <p className={styles.text}>{t('t1.s05.tension_title')}</p>

      <ol className={styles.reglas}>
        {reglas.map((r) => (
          <li key={r.titulo}>
            <span className={styles.reglaTitulo}>{r.titulo}</span> · <Prose segment={r.cuerpo} />
          </li>
        ))}
      </ol>

      {/* TODO i18n: sin clave — primitiva título e instrucción */}
      <h3 className={styles.subheading}>{TENSION_PRIMITIVA_TITULO}</h3>
      <p className={styles.text}>{TENSION_PRIMITIVA_INSTRUCCION}</p>
      <TensionResolucion />

      <RuleNote>{t('t1.s05.tip')}</RuleNote>
    </section>
  );
}
