import NotasNaturalesSection from './components/NotasNaturalesSection';
import CirculoCromaticoSection from './components/CirculoCromaticoSection';
import IntervalosSection from './components/IntervalosSection';
import TriadasSection from './components/TriadasSection';
import styles from './T1Module.module.css';

export default function T1Module() {
  return (
    <main className={styles.main}>
      <NotasNaturalesSection />
      <CirculoCromaticoSection />
      <IntervalosSection />
      <TriadasSection />
    </main>
  );
}
