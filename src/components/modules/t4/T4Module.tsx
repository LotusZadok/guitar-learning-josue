import RelativasMenoresSection from './components/RelativasMenoresSection';
import SeptimasMenorSection from './components/SeptimasMenorSection';
import ProgresionMenorSection from './components/ProgresionMenorSection';
import SegundaCuartaSection from './components/SegundaCuartaSection';
import SuspendidosSection from './components/SuspendidosSection';
import styles from './T4Module.module.css';

// T4 · el mundo menor (reunión 19/10/26: "lo dejaríamos perfectamente en una T
// aparte, para que no embarre tanto la cancha"). Los números 4.3 (acordes
// aumentados), 4.4 (escala menor armónica) y 4.8 (progresiones en menor)
// quedan reservados hasta que el profesor apruebe su contenido.
export default function T4Module() {
  return (
    <div className={styles.main}>
      <RelativasMenoresSection />
      <SeptimasMenorSection />
      <ProgresionMenorSection />
      <SegundaCuartaSection />
      <SuspendidosSection />
    </div>
  );
}
