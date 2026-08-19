import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import TensionResolucion from '../../../primitives/TensionResolucion/TensionResolucion';
import styles from './TritonoSection.module.css';

// 3.6.1 · El tritono fuera del acorde. Reusa el mapa de resoluciones de §1.5 con
// `focus="tritono"`: los dos grados tensos de la escala (4ª y 7ª) SON el tritono
// de la tonalidad, y el mapa ya dibuja sus resoluciones por semitono. §3.6.2 lo
// vuelve a mostrar, ya dentro del V7 y del vii.
export default function TritonoSection() {
  const { t } = useTranslation();

  return (
    <section id="s-t3-tritono" className={styles.section}>
      <SectionLabel text={t('t3.s361.label')} />
      <h2>{t('t3.s361.title')}</h2>

      <p className={styles.text}>{t('t3.s361.intro')}</p>

      <TensionResolucion focus="tritono" />

      <RuleNote>{t('t3.s361.caption')}</RuleNote>
    </section>
  );
}
