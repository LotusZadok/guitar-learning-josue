import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import GradosArmonicos from '../../../primitives/GradosArmonicos/GradosArmonicos';
import { useUIStore } from '../../../../stores/useUIStore';
import styles from './SeptimasMenorSection.module.css';

// 3.9 · Escala menor con séptimas (relativa). Reutiliza GradosArmonicos (§3.5):
// misma primitiva, re-anclada en la relativa menor natural de la tónica activa
// (comparten armadura — ver `relativeMinorScaleSpelled`).
export default function SeptimasMenorSection() {
  const { t } = useTranslation();
  const tonic = useUIStore((s) => s.tonic);

  return (
    <section id="s-t3-escala-menor" className={styles.section}>
      <SectionLabel text={t('t3.s39.label')} />
      <h2>{t('t3.s39.title')}</h2>

      <p className={styles.text}>{t('t3.s39.intro')}</p>

      <p className={styles.pattern}>m7 · m7♭5 · maj7 · m7 · m7 · maj7 · 7</p>

      <GradosArmonicos tonalidad={tonic} initialStep={4} relativeMinor />

      <p className={styles.text}>{t('t3.s39.harmonic')}</p>
    </section>
  );
}
