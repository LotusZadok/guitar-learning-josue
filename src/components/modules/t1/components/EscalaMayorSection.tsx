import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import Prose from '../../../shared/Prose/Prose';
import EscalaMayor from '../../../primitives/EscalaMayor/EscalaMayor';
import { useUIStore } from '../../../../stores/useUIStore';
import { majorScaleSpelled } from '../../../../utils/noteCalculations';
import type { NoteSpelling } from '../../../../types/music';
import type { ProseSegment } from '../../../../types/prose';
import {
  ESCALA_TABLA_HEAD,
  ESCALA_PRIMITIVA_TITULO,
  ESCALA_PRIMITIVA_INSTRUCCION,
} from '../data/literalContent';
import styles from './EscalaMayorSection.module.css';

const VALID_NOTE_SPELLINGS = new Set([
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Db', 'Eb', 'Gb', 'Ab', 'Bb',
]);

export default function EscalaMayorSection() {
  const { t } = useTranslation();
  const tonic = useUIStore((s) => s.tonic);
  const spelledScale = useMemo(() => majorScaleSpelled(tonic), [tonic]);

  // ASCII form of tonic (e.g. 'Bb' for A#, 'G' for G) for the NoteToken label.
  const tonicAscii = useMemo(
    () => spelledScale[0].replace('♯', '#').replace('♭', 'b'),
    [spelledScale],
  );
  // Dynamic intro: "Ejemplo en {T} mayor:"
  const ejemploIntro = useMemo<ProseSegment>(
    () => [
      { type: 'text', value: 'Ejemplo en ' },
      { type: 'note', value: tonicAscii },
      { type: 'text', value: ' mayor:' },
    ],
    [tonicAscii],
  );
  // Notes row: 7 spelled + octave repeat. Glyph → ASCII for NoteToken.
  const notasRow = useMemo(
    () => [
      ...spelledScale.map((n) => n.replace('♯', '#').replace('♭', 'b')),
      tonicAscii,
    ],
    [spelledScale, tonicAscii],
  );

  return (
    <section id="s-escala" className={styles.section}>
      {/* TODO i18n: sin clave para label de la sección en de.json (se usa t1.s05/s06) */}
      <SectionLabel text={t('t1.s05.label')} />
      {/* TODO i18n: sin clave — h2 no tiene clave directa en de.json */}
      <h2>Escala mayor: notas estables y tensas</h2>

      <p className={styles.text}>{t('t1.s05.intro')}</p>

      <p className={styles.text}><Prose segment={ejemploIntro} /></p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {ESCALA_TABLA_HEAD.map((h, i) => (
                <th key={i} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Nota</th>
              {notasRow.map((n, i) => (
                <td key={i}>
                  {VALID_NOTE_SPELLINGS.has(n)
                    ? <NoteToken note={n as NoteSpelling} />
                    : <span>{n}</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* TODO i18n: sin clave — roleGrid labels no tienen clave en de.json */}
      <p className={styles.text}>La escala se divide en:</p>
      <div className={styles.roleGrid}>
        {([
          { color: 'var(--diatonic-stable)',  label: 'Estable',    degrees: ['1', '3', '5'] },
          { color: 'var(--diatonic-medium)',  label: 'Intermedia', degrees: ['2', '6'] },
          { color: 'var(--diatonic-tense)',   label: 'Tensa',      degrees: ['4', '7'] },
        ] as const).map(({ color, label, degrees }) => (
          <div key={label} className={styles.roleRow}>
            <span className={styles.roleDot} style={{ background: color }} />
            <span className={styles.roleLabel}>{label}</span>
            <span className={styles.roleDegrees}>
              {degrees.map((d) => (
                <span key={d} className={styles.roleBadge} style={{ borderColor: color }}>{d}</span>
              ))}
            </span>
          </div>
        ))}
      </div>

      {/* TODO i18n: sin clave — primitiva título e instrucción */}
      <h3 className={styles.subheading}>{ESCALA_PRIMITIVA_TITULO}</h3>
      <p className={styles.text}>{ESCALA_PRIMITIVA_INSTRUCCION}</p>
      <EscalaMayor />
    </section>
  );
}
