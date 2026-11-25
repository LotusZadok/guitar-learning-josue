import RelativasMenoresSection from './components/RelativasMenoresSection';
import SeptimasMenorSection from './components/SeptimasMenorSection';
import ArmonicaSection from './components/ArmonicaSection';
import ProgresionMenorSection from './components/ProgresionMenorSection';
import SegundaCuartaSection from './components/SegundaCuartaSection';
import SuspendidosSection from './components/SuspendidosSection';
import styles from './T4Module.module.css';

// T4 · el mundo menor (reunión 19/10/26: "lo dejaríamos perfectamente en una T
// aparte, para que no embarre tanto la cancha"). 4.4 (escala menor armónica)
// sale del borrador del 19/10/26, publicado sin la aprobación del profesor por
// decisión de Sebastián (24/11/26). Quedan reservados 4.3 y 4.8.
export default function T4Module() {
  return (
    <div className={styles.main}>
      <RelativasMenoresSection />
      <SeptimasMenorSection />
      <ArmonicaSection />
      <ProgresionMenorSection />
      <SegundaCuartaSection />
      <SuspendidosSection />
    </div>
  );
}
