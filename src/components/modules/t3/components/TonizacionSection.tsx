import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import DominantesSecundarias from '../../../primitives/DominantesSecundarias/DominantesSecundarias';
import styles from './TonizacionSection.module.css';

// 3.8 · Tonización (dominantes secundarias). Cualquier grado (menos el I) puede
// tonizarse insertando su dominante V/x.
export default function TonizacionSection() {
  const { t } = useTranslation();

  return (
    <section id="s-t3-tonizacion" className={styles.section}>
      <SectionLabel text={t('t3.s38.label')} />
      <h2>{t('t3.s38.title')}</h2>

      <p className={styles.text}>{t('t3.s38.intro')}</p>
      <p className={styles.text}>{t('t3.s38.construction')}</p>

      <DominantesSecundarias />

      <p className={styles.text}>{t('t3.s38.generalization')}</p>
    </section>
  );
}
