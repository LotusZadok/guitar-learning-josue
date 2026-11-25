import ConstructorCompletoSection from './components/ConstructorCompletoSection';
import TonizacionSection from './components/TonizacionSection';
import ModulacionSection from './components/ModulacionSection';
import ConstructorProgresionesSection from './components/ConstructorProgresionesSection';
import styles from './T5Module.module.css';

// T5 · poner en práctica lo aprendido (reunión 19/10/26): el constructor de
// acordes, la tonización, la modulación y el laboratorio de armonía. El 5.3
// sale del borrador del 19/10/26, publicado sin la aprobación del profesor por
// decisión de Sebastián (24/11/26).
export default function T5Module() {
  return (
    <div className={styles.main}>
      <ConstructorCompletoSection />
      <TonizacionSection />
      <ModulacionSection />
      <ConstructorProgresionesSection />
    </div>
  );
}
