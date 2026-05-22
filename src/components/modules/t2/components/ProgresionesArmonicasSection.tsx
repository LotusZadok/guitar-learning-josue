import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import ProgresionesArmonicas from '../../../primitives/ProgresionesArmonicas/ProgresionesArmonicas';
import { useUIStore } from '../../../../stores/useUIStore';
import {
  PROGRESIONES_PRIMITIVA_INSTRUCCION,
  PROGRESIONES_PRIMITIVA_INSTRUCCION_DE,
} from '../data/literalContent';
import styles from './ProgresionesArmonicasSection.module.css';

export default function ProgresionesArmonicasSection() {
  const { t, i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const tonalidad = useUIStore((s) => s.tonic);
  const procedure = t('t2.s48.procedure', { returnObjects: true }) as string[];
  const primitivaInstruccion = isDe ? PROGRESIONES_PRIMITIVA_INSTRUCCION_DE : PROGRESIONES_PRIMITIVA_INSTRUCCION;

  return (
    <section id="s-t2-progresiones" className={styles.section}>
      <SectionLabel text={t('t2.s48.label')} />
      <h2>{t('t2.s48.title')}</h2>

      <p className={styles.text}>{t('t2.s48.intro')}</p>

      <h3 className={styles.subheading}>{t('t2.s48.procedure_title')}</h3>
      <ol className={styles.pasos}>
        {procedure.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <p className={styles.text}>{primitivaInstruccion}</p>

      <ProgresionesArmonicas tonalidad={tonalidad} />

      <RuleNote>{t('t2.s48.tip')}</RuleNote>
    </section>
  );
}
