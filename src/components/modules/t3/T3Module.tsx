import SeptimasSection from './components/SeptimasSection';
import SeptimaAcordesSection from './components/SeptimaAcordesSection';
import DisminuidosSection from './components/DisminuidosSection';
import GradoSeptimoSection from './components/GradoSeptimoSection';
import TritonoSection from './components/TritonoSection';
import DominanteSection from './components/DominanteSection';
import ProgresionIIVISection from './components/ProgresionIIVISection';
import styles from './T3Module.module.css';

// Orden del profesor (reunión 19/10/26): T3 se queda en el mundo mayor con
// séptimas, de las séptimas al ii-V-I. Lo menor pasó a T4 y la práctica
// (constructor, tonización, laboratorio) a T5.
export default function T3Module() {
  return (
    <div className={styles.main}>
      <SeptimasSection />
      <SeptimaAcordesSection />
      <DisminuidosSection />
      <GradoSeptimoSection />
      <TritonoSection />
      <DominanteSection />
      <ProgresionIIVISection />
    </div>
  );
}
