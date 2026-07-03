import SeptimasSection from './components/SeptimasSection';
import SeptimaAcordesSection from './components/SeptimaAcordesSection';
import DisminuidosSection from './components/DisminuidosSection';
import SegundaCuartaSection from './components/SegundaCuartaSection';
import SuspendidosSection from './components/SuspendidosSection';
import ConstructorCompletoSection from './components/ConstructorCompletoSection';
import GradoSeptimoSection from './components/GradoSeptimoSection';
import DominanteSection from './components/DominanteSection';
import ProgresionIIVISection from './components/ProgresionIIVISection';
import TonizacionSection from './components/TonizacionSection';
import SeptimasMenorSection from './components/SeptimasMenorSection';
import ProgresionMenorSection from './components/ProgresionMenorSection';
import styles from './T3Module.module.css';

export default function T3Module() {
  return (
    <main className={styles.main}>
      <SeptimasSection />
      <SeptimaAcordesSection />
      <DisminuidosSection />
      <SegundaCuartaSection />
      <SuspendidosSection />
      <ConstructorCompletoSection />
      <GradoSeptimoSection />
      <DominanteSection />
      <ProgresionIIVISection />
      <TonizacionSection />
      <SeptimasMenorSection />
      <ProgresionMenorSection />
    </main>
  );
}
