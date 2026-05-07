import NotasNaturalesSection from './components/NotasNaturalesSection';
import CirculoCromaticoSection from './components/CirculoCromaticoSection';
import IntervalosSection from './components/IntervalosSection';
import EscalaMayorSection from './components/EscalaMayorSection';
import TensionResolucionSection from './components/TensionResolucionSection';
import TriadasSection from './components/TriadasSection';
import AcordesSection from './components/AcordesSection';
import ReglaQuintaSection from './components/ReglaQuintaSection';
import styles from './T1Module.module.css';

export default function T1Module() {
  return (
    <main className={styles.main}>
      <NotasNaturalesSection />
      <CirculoCromaticoSection />
      <IntervalosSection />
      <EscalaMayorSection />
      <TensionResolucionSection />
      <TriadasSection />
      <AcordesSection />
      <ReglaQuintaSection />
    </main>
  );
}
