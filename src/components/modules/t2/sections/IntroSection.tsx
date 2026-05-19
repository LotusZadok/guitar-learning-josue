import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import {
  INTRO_LENGUAS, INTRO_VARIEDAD,
  DEF_TONALIDADES, DEF_ARMADURA,
  REGLA_NO_MEZCLA, CONCLUSION_COHABITAN,
} from '../data/literalContent';
import styles from './IntroSection.module.css';

export default function IntroSection() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <SectionLabel text={t('t2.s41.label')} />
      <h2>{t('t2.s41.title')}</h2>

      {/* TODO i18n: sin clave — contenido de intro en de.json s41 no tiene body keys */}
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
