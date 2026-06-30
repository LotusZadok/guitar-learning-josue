import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import ChordStacks, { type ChordDef } from '../../../primitives/ChordStacks/ChordStacks';
import AcordesBuilder from '../../../primitives/AcordesBuilder/AcordesBuilder';
import { BUILDER_32 } from '../../../primitives/AcordesBuilder/configs';
import styles from './DisminuidosSection.module.css';

// 3.2 · Acordes disminuidos. m7♭5 y dim7 comparten T·3m·5d y solo difieren en
// la 7ª (7m vs 7d). Fórmulas del source of truth de T3.
const ROWS = [
  { formula: 'T + 3m + 5d + 7m', code: 'm7♭5' },
  { formula: 'T + 3m + 5d + 7d', code: 'dim7' },
] as const;

// Solo la 7ª cambia entre las dos familias (se resalta).
const CHORDS: ChordDef[] = [
  {
    suffix: 'm7♭5',
    tones: [
      { role: '7', number: 7, quality: 'm', moves: true },
      { role: '5', number: 5, quality: 'dim' },
      { role: '3', number: 3, quality: 'm' },
      { role: 'T', number: 1, quality: 'P' },
    ],
  },
  {
    suffix: 'dim7',
    tones: [
      { role: '7', number: 7, quality: 'dim', moves: true },
      { role: '5', number: 5, quality: 'dim' },
      { role: '3', number: 3, quality: 'm' },
      { role: 'T', number: 1, quality: 'P' },
    ],
  },
];

// Las 3 familias absolutas de dim7 (no dependen de la tónica activa): por la
// simetría de terceras menores, cada acorde dim7 se repite cada 3 semitonos.
const GROUPS = [
  'C° = E♭° = G♭° = A°',
  'C♯° = E° = G° = B♭°',
  'D° = F° = A♭° = B°',
];

export default function DisminuidosSection() {
  const { t } = useTranslation();
  const h = t('t3.s32.table_headers', { returnObjects: true }) as Record<string, string>;
  const names = t('t3.s32.chords', { returnObjects: true }) as string[];

  return (
    <section id="s-t3-disminuidos" className={styles.section}>
      <SectionLabel text={t('t3.s32.label')} />
      <h2>{t('t3.s32.title')}</h2>

      <p className={styles.text}>{t('t3.s32.intro')}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{h.chord}</th>
              <th scope="col">{h.formula}</th>
              <th scope="col">{h.code}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.code}>
                <th scope="row">{names[i]}</th>
                <td>{r.formula}</td>
                <td>{r.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{t('t3.s32.difference')}</p>

      <ChordStacks chords={CHORDS} />

      <h3 className={styles.subheading}>{t('t3.s32.symmetry_title')}</h3>
      <p className={styles.text}>{t('t3.s32.symmetry')}</p>

      <ul className={styles.groups}>
        {GROUPS.map((g) => (
          <li key={g} className={styles.group}>
            {g}
          </li>
        ))}
      </ul>

      <p className={styles.text}>{t('t3.s32.function')}</p>

      <h3 className={styles.subheading}>{t('t3.s32.builder_title')}</h3>
      <p className={styles.text}>{t('t3.s32.builder_intro')}</p>
      <AcordesBuilder config={BUILDER_32} />
    </section>
  );
}
