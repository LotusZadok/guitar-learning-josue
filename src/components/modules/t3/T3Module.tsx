import SeptimasSection from './components/SeptimasSection';
import SeptimaAcordesSection from './components/SeptimaAcordesSection';
import DisminuidosSection from './components/DisminuidosSection';
import SegundaCuartaSection from './components/SegundaCuartaSection';
import SuspendidosSection from './components/SuspendidosSection';
import ConstructorCompletoSection from './components/ConstructorCompletoSection';
import GradoSeptimoSection from './components/GradoSeptimoSection';
import DominanteSection from './components/DominanteSection';
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
    </main>
  );
}
