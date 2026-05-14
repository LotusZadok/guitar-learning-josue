import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import GradosArmonicos from '../../../primitives/GradosArmonicos/GradosArmonicos';
import { useUIStore } from '../../../../stores/useUIStore';
import {
  GRADOS_INTRO_SIMETRIA,
  GRADOS_INTRO_FRACTAL,
  GRADOS_PROCEDIMIENTO_TITULO,
  GRADOS_PROCEDIMIENTO_PASOS,
  GRADOS_PRIMITIVA_INSTRUCCION,
  GRADOS_PATRON,
  GRADOS_NOMBRE_CARACTER_TITULO,
  GRADOS_NOMBRE_CARACTER,
  GRADOS_ANALISIS_ESTABLES,
  GRADOS_ANALISIS_TENSOS,
  GRADOS_ANALISIS_MEDIOS,
  GRADOS_ANALISIS_IV,
  GRADOS_CONSEJO,
} from '../data/literalContent';
import styles from './GradosArmonicosSection.module.css';

export default function GradosArmonicosSection() {
  const tonalidad = useUIStore((s) => s.tonic);

  return (
    <section className={styles.section}>
      <SectionLabel text="4.7 · Grados armónicos" />
      <h2>Grados armónicos según la escala mayor</h2>

      <p className={styles.text}>{GRADOS_INTRO_SIMETRIA}</p>
      <p className={styles.text}>{GRADOS_INTRO_FRACTAL}</p>

      <h3 className={styles.subheading}>{GRADOS_PROCEDIMIENTO_TITULO}</h3>
      <ol className={styles.pasos}>
        {GRADOS_PROCEDIMIENTO_PASOS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>

      <p className={styles.text}>{GRADOS_PRIMITIVA_INSTRUCCION}</p>

      <GradosArmonicos tonalidad={tonalidad} />

      <p className={styles.patron}>{GRADOS_PATRON}</p>

      <h3 className={styles.subheading}>{GRADOS_NOMBRE_CARACTER_TITULO}</h3>
      <div className={styles.tableWrap}>
        <table className={styles.caracterTable}>
          <thead>
            <tr>
              <th scope="col">Grado</th>
              <th scope="col">Nombre</th>
              <th scope="col">Carácter</th>
            </tr>
          </thead>
          <tbody>
            {GRADOS_NOMBRE_CARACTER.map((g) => (
              <tr key={g.roman}>
                <td className={styles.romanCell}>{g.roman}</td>
                <td>{g.nombre}</td>
                <td className={styles.caracterCell}>{g.caracter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{GRADOS_ANALISIS_ESTABLES}</p>
      <p className={styles.text}>{GRADOS_ANALISIS_TENSOS}</p>
      <p className={styles.text}>{GRADOS_ANALISIS_MEDIOS}</p>
      <p className={styles.text}>{GRADOS_ANALISIS_IV}</p>

      <RuleNote>{GRADOS_CONSEJO}</RuleNote>
    </section>
  );
}
