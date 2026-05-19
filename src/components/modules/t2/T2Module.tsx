import IntroSection from './sections/IntroSection';
import HerramientaSection from './sections/HerramientaSection';
import ProcesoSostenidosSection from './sections/ProcesoSostenidosSection';
import ProcesoBemolesSection from './sections/ProcesoBemolesSection';
import TablaMaestraSection from './sections/TablaMaestraSection';
import GradosArmonicosSection from './components/GradosArmonicosSection';
import ProgresionesArmonicasSection from './components/ProgresionesArmonicasSection';
import ModoClaseSection from './sections/ModoClaseSection';
import styles from './T2Module.module.css';

export default function T2Module() {
  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <IntroSection />
        <HerramientaSection />
        <ProcesoSostenidosSection />
        <ProcesoBemolesSection />
        <TablaMaestraSection />
        <GradosArmonicosSection />
        <ProgresionesArmonicasSection />
        <ModoClaseSection />
      </main>
    </div>
  );
}
