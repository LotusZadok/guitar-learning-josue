import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.text}>Apuntes Guitarra · Referencia Personal</div>
      <div className={styles.text}>EADGBE · 12 Notas · Sistema CAGED</div>
    </footer>
  );
}
