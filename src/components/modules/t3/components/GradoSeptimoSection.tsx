import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import GradosArmonicos from '../../../primitives/GradosArmonicos/GradosArmonicos';
import { useUIStore } from '../../../../stores/useUIStore';
import styles from './GradoSeptimoSection.module.css';

// 3.5 · Grado 7 y armonía diatónica con séptimas. Reutiliza GradosArmonicos (su
// paso 4 ya arma los acordes diatónicos con séptima); aquí arranca en ese paso y
// se enmarca en T3: el grado 7 (vii) es el m7♭5 que vimos en §3.2.
export default function GradoSeptimoSection() {
  const { t } = useTranslation();
  const tonic = useUIStore((s) => s.tonic);

  return (
    <section id="s-t3-grado-7" className={styles.section}>
      <SectionLabel text={t('t3.s35.label')} />
      <h2>{t('t3.s35.title')}</h2>

      <p className={styles.text}>{t('t3.s35.intro')}</p>

      <p className={styles.pattern}>maj7 · m7 · m7 · maj7 · 7 · m7 · m7♭5</p>

      <GradosArmonicos tonalidad={tonic} initialStep={4} />

      <p className={styles.text}>{t('t3.s35.grado7')}</p>
    </section>
  );
}
