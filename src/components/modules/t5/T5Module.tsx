import ConstructorCompletoSection from './components/ConstructorCompletoSection';
import TonizacionSection from './components/TonizacionSection';
import ConstructorProgresionesSection from './components/ConstructorProgresionesSection';
import styles from './T5Module.module.css';

// T5 · poner en práctica lo aprendido (reunión 19/10/26): el constructor de
// acordes, la tonización y el laboratorio de armonía. El 5.3 (modulación)
// queda reservado hasta que el profesor apruebe su contenido.
export default function T5Module() {
  return (
    <div className={styles.main}>
      <ConstructorCompletoSection />
      <TonizacionSection />
      <ConstructorProgresionesSection />
    </div>
  );
}
