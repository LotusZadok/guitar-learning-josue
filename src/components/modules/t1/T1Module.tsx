import SectionLabel from '../../shared/SectionLabel';
import styles from './T1Module.module.css';

export default function T1Module() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <SectionLabel text="Módulo T1 · Fundamentos" />
        <h2>Fundamentos musicales</h2>
        <p className={styles.text}>
          Este módulo cubrirá los cimientos del método: la nomenclatura de las notas,
          el sistema de doce semitonos, los intervalos básicos y la lectura del
          mástil. Está en construcción.
        </p>
        <p className={styles.meta}>EADGBE · 12 Notas · Sistema CAGED</p>
      </section>
    </main>
  );
}
