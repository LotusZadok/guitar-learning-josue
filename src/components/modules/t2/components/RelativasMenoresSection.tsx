import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import Prose from '../../../shared/Prose/Prose';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import RelativasMenores from '../../../primitives/RelativasMenores/RelativasMenores';
import { useUIStore } from '../../../../stores/useUIStore';
import { ALL } from '../../../../data/notes';
import type { NoteSpelling, ChromaticNote } from '../../../../types/music';
import { TONALIDADES } from '../data/tonalidades';
import {
  RELATIVAS_INTRO,
  RELATIVAS_INTRO_DE,
} from '../data/literalContent';
import styles from './RelativasMenoresSection.module.css';

// Reunión 24/5/26: tabla con TODAS las tonalidades (estilo §2.5).
// La menor relativa es el 6º grado (scale[5]) de la escala mayor.
interface RelativaRow {
  mayor: string;
  menor: string;
  armadura: readonly string[];
  /** Forma cromática de la tónica mayor — para el highlight contra useUIStore.tonic. */
  chromatic: ChromaticNote;
}

// Mapea spelling con bemol al equivalente sharp del ChromaticNote.
const FLAT_TO_SHARP: Record<string, ChromaticNote> = {
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
  'Cb': 'B', 'Fb': 'E',
};
function spelledToChromatic(s: string): ChromaticNote {
  if ((ALL as readonly string[]).includes(s)) return s as ChromaticNote;
  if (FLAT_TO_SHARP[s]) return FLAT_TO_SHARP[s];
  return s[0] as ChromaticNote;
}

const TABLA_ROWS: RelativaRow[] = [
  // C natural — encabeza la lista (sin armadura).
  { mayor: 'C', menor: 'A', armadura: [], chromatic: 'C' },
  ...TONALIDADES.map<RelativaRow>((t) => ({
    mayor: t.tonica,
    menor: t.escala[5],
    armadura: t.armadura,
    chromatic: spelledToChromatic(t.tonica),
  })),
];

const VALID_SPELLINGS: ReadonlySet<string> = new Set([
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Db', 'Eb', 'Gb', 'Ab', 'Bb',
]);
function renderNote(s: string) {
  return VALID_SPELLINGS.has(s)
    ? <NoteToken note={s as NoteSpelling} />
    : <span>{s.replace('#', '♯').replace('b', '♭')}</span>;
}

export default function RelativasMenoresSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const tonic = useUIStore((s) => s.tonic);

  const intro = locale === 'de' ? RELATIVAS_INTRO_DE : RELATIVAS_INTRO;
  const process = t('t2.s49.process', { returnObjects: true }) as string[];

  return (
    <section id="s-t2-relativas" className={styles.section}>
      <SectionLabel text={t('t2.s49.label')} />
      <h2>{t('t2.s49.title')}</h2>

      {intro.map((seg, i) => (
        <p key={i} className={styles.text}>
          <Prose segment={seg} />
        </p>
      ))}

      <h3 className={styles.subheading}>{t('t2.s49.process_title')}</h3>
      <ol className={styles.pasos}>
        {process.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <RelativasMenores tonic={tonic} />

      <div className={styles.tableWrap}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th scope="col">{t('t2.s49.table_headers.major')}</th>
              <th scope="col">{t('t2.s49.table_headers.minor')}</th>
              <th scope="col">{t('t2.s49.table_headers.key_signature')}</th>
            </tr>
          </thead>
          <tbody>
            {TABLA_ROWS.map((row) => {
              const isActive = row.chromatic === tonic;
              return (
                <tr key={row.mayor} className={isActive ? styles.rowActive : undefined}>
                  <td>{renderNote(row.mayor)} {t('common.major')}</td>
                  <td>{renderNote(row.menor)}m</td>
                  <td>
                    {row.armadura.length === 0
                      ? t('t2.s49.table_no_sharps_flats')
                      : row.armadura.map((n, i) => (
                          <span key={n}>
                            {i > 0 && ' '}
                            {renderNote(n)}
                          </span>
                        ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <RuleNote>{t('t2.s49.tip')}</RuleNote>
    </section>
  );
}
