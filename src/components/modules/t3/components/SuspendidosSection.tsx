import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import Prose from '../../../shared/Prose/Prose';
import ChordStacks, { type ChordDef } from '../../../primitives/ChordStacks/ChordStacks';
import AcordesBuilder from '../../../primitives/AcordesBuilder/AcordesBuilder';
import { BUILDER_33 } from '../../../primitives/AcordesBuilder/configs';
import { useUIStore } from '../../../../stores/useUIStore';
import { intervalMemberFromTonic } from '../../../../utils/noteCalculations';
import type { NoteSpelling } from '../../../../types/music';
import type { ProseSegment } from '../../../../types/prose';
import styles from './SuspendidosSection.module.css';

// 3.3 · Acordes suspendidos. sus2 y sus4 reemplazan la tercera por la 2M o la 4J;
// comparten T y 5J. Fórmulas del source of truth de T3.
const ROWS = [
  { formula: 'T + 2M + 5J', code: 'sus2' },
  { formula: 'T + 4J + 5J', code: 'sus4' },
] as const;

// La nota del medio (2 o 4) es la que cambia; T y 5 son compartidas.
const CHORDS: ChordDef[] = [
  {
    suffix: 'sus2',
    tones: [
      { role: '5', number: 5, quality: 'P' },
      { role: '2', number: 2, quality: 'M', moves: true },
      { role: 'T', number: 1, quality: 'P' },
    ],
  },
  {
    suffix: 'sus4',
    tones: [
      { role: '5', number: 5, quality: 'P' },
      { role: '4', number: 4, quality: 'P', moves: true },
      { role: 'T', number: 1, quality: 'P' },
    ],
  },
];

// NoteToken espera grafía ASCII; los cifrados en prosa van con el glifo real.
const ASCII = (v: string) => v.replace('♯', '#').replace('♭', 'b') as NoteSpelling;

export default function SuspendidosSection() {
  const { t } = useTranslation();
  const h = t('t3.s33.table_headers', { returnObjects: true }) as Record<string, string>;
  const tonic = useUIStore((s) => s.tonic);

  // Reunión 19/8/26: el ejemplo de resolución sigue la tónica global en vez de
  // quedarse en C, y las notas que se mueven son tokens (suenan al pasar). Los
  // cifrados (Xsus4 → X) van como texto: son acordes, no notas sueltas.
  const spelled = (number: 1 | 2 | 3 | 4, quality: 'P' | 'M') =>
    intervalMemberFromTonic(tonic, number, quality).spelled;
  const root = spelled(1, 'P');
  const vars = { tonic: root, sus4: `${root}sus4`, sus2: `${root}sus2` };
  const third = ASCII(spelled(3, 'M'));
  const resolution: ProseSegment = [
    { type: 'text', value: t('t3.s33.resolution_parts.lead', vars) },
    { type: 'note', value: ASCII(spelled(4, 'P')) },
    { type: 'text', value: ' → ' },
    { type: 'note', value: third },
    { type: 'text', value: t('t3.s33.resolution_parts.mid', vars) },
    { type: 'note', value: ASCII(spelled(2, 'M')) },
    { type: 'text', value: ' → ' },
    { type: 'note', value: third },
    { type: 'text', value: t('t3.s33.resolution_parts.tail') },
  ];
  const names = t('t3.s33.chords', { returnObjects: true }) as string[];

  return (
    <section id="s-t3-suspendidos" className={styles.section}>
      <SectionLabel text={t('t3.s33.label')} />
      <h2>{t('t3.s33.title')}</h2>

      <p className={styles.text}>{t('t3.s33.intro')}</p>

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

      <ChordStacks chords={CHORDS} />

      <RuleNote>{t('t3.s33.caption')}</RuleNote>

      <h3 className={styles.subheading}>{t('t3.s33.resolution_title')}</h3>
      <p className={styles.text}><Prose segment={resolution} /></p>

      <h3 className={styles.subheading}>{t('t3.s33.builder_title')}</h3>
      <p className={styles.text}>{t('t3.s33.builder_intro')}</p>
      <AcordesBuilder config={BUILDER_33} />
    </section>
  );
}
