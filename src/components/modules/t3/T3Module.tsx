import SeptimasSection from './components/SeptimasSection';
import SeptimaAcordesSection from './components/SeptimaAcordesSection';
import DisminuidosSection from './components/DisminuidosSection';
import SegundaCuartaSection from './components/SegundaCuartaSection';
import styles from './T3Module.module.css';

export default function T3Module() {
  return (
    <main className={styles.main}>
      <SeptimasSection />
      <SeptimaAcordesSection />
      <DisminuidosSection />
      <SegundaCuartaSection />
    </main>
  );
}
