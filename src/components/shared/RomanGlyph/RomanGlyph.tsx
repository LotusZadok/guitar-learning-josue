import type { DiatonicRole } from '../NoteToken/NoteToken';
import styles from './RomanGlyph.module.css';

// Reunión 24/5/26: color por formato armónico (no por mayor/menor visual).
// Generalizado en §3.9 para 'ii°' (menor) además de 'vii°' (mayor): cualquier
// grado disminuido termina en '°', sin importar el modo. Extraído de
// GradosArmonicos en la ola de T4 porque el constructor de progresiones lo
// necesita en el banco y en la grilla.
export default function RomanGlyph({ roman, role }: { roman: string; role: DiatonicRole }) {
  const isDim = roman.endsWith('°');
  const isMajor = !isDim && roman === roman.toUpperCase();
  return (
    <span
      className={isDim ? styles.romanDim : isMajor ? styles.romanMajor : styles.romanMinor}
      data-harmonic={role}
    >
      {roman}
    </span>
  );
}
