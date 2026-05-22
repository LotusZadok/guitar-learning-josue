import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.eyebrow}>Referencia Musical · Guitarra Eléctrica / Acústica</div>
      <h1 className={styles.title}>
        Apuntes de<br /><span>Guitarra</span>
      </h1>
      <div className={styles.sub}>"Las notas no suben — la mano baja"</div>
    </header>
  );
}
