import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import Prose from '../../../shared/Prose/Prose';
import TensionResolucion from '../../../primitives/TensionResolucion/TensionResolucion';
import { useUIStore } from '../../../../stores/useUIStore';
import { majorScaleSpelled, spelledNameES, tonicChromatic } from '../../../../utils/noteCalculations';
import type { NoteSpelling, Tonic } from '../../../../types/music';
import type { ProseSegment } from '../../../../types/prose';
import {
  TENSION_PRIMITIVA_INSTRUCCION,
  TENSION_PRIMITIVA_INSTRUCCION_DE,
} from '../data/literalContent';

const ASCII = (s: string) => s.replace('♯', '#').replace('♭', 'b') as NoteSpelling;

// Reunión 24/5/26: las reglas de tensión deben renderizar la tónica activa, no quedarse en C.
function buildReglas(tonic: Tonic, isDe: boolean): { titulo: string; cuerpo: ProseSegment }[] {
  const scale = majorScaleSpelled(tonic).map(ASCII); // [1,2,3,4,5,6,7]
  const tn = ASCII(scale[0]);
  const ctx = (label: string): ProseSegment => isDe
    ? [{ type: 'text', value: 'In ' }, { type: 'note', value: tn }, { type: 'text', value: ' Dur: ' }]
    : [{ type: 'text', value: 'En ' }, { type: 'note', value: tn }, { type: 'text', value: ` ${label}: ` }];

  return [
    {
      titulo: isDe ? '2. Stufe' : '2do grado',
      cuerpo: [
        ...(isDe
          ? [{ type: 'text' as const, value: 'löst zur Tonika oder zur 3. Stufe auf. ' }]
          : [{ type: 'text' as const, value: 'resuelve a la tónica o al 3er grado. ' }]),
        ...ctx('mayor'),
        { type: 'note', value: scale[1] }, { type: 'text', value: ' → ' }, { type: 'note', value: scale[0] },
        { type: 'text', value: isDe ? ' oder ' : ' o ' },
        { type: 'note', value: scale[1] }, { type: 'text', value: ' → ' }, { type: 'note', value: scale[2] },
        { type: 'text', value: '.' },
      ],
    },
    {
      titulo: isDe ? '4. Stufe' : '4to grado',
      cuerpo: [
        ...(isDe
          ? [{ type: 'text' as const, value: 'löst zur 3. oder zur 5. Stufe auf. Stärkere Spannung zur 3. Stufe, weil sie nur 1 Halbton entfernt ist. Die 4. Stufe heißt auch „modaler Leitton". ' }]
          : [{ type: 'text' as const, value: 'resuelve al 3er o al 5to grado. Tiene más tensión hacia el 3er grado porque está a 1 s.t. (mayor tensión que 2 s.t.). El 4to también se llama "sensible modal". ' }]),
        ...ctx('mayor'),
        { type: 'note', value: scale[3] }, { type: 'text', value: ' → ' }, { type: 'note', value: scale[2] },
        { type: 'text', value: isDe ? ' oder ' : ' o ' },
        { type: 'note', value: scale[3] }, { type: 'text', value: ' → ' }, { type: 'note', value: scale[4] },
        { type: 'text', value: '.' },
      ],
    },
    {
      titulo: isDe ? '6. Stufe' : '6to grado',
      cuerpo: [
        ...(isDe
          ? [{ type: 'text' as const, value: 'löst zur 5. Stufe auf. ' }]
          : [{ type: 'text' as const, value: 'resuelve al 5to grado. ' }]),
        ...ctx('mayor'),
        { type: 'note', value: scale[5] }, { type: 'text', value: ' → ' }, { type: 'note', value: scale[4] },
        { type: 'text', value: '.' },
      ],
    },
    {
      titulo: isDe ? '7. Stufe' : '7mo grado',
      cuerpo: [
        ...(isDe
          ? [{ type: 'text' as const, value: 'löst zur Tonika auf. Das ist die wichtigste Auflösung der Tonalmusik — nur 1 Halbton entfernt, daher die stärkste Spannung. Die 7. Stufe heißt „Leitton". ' }]
          : [{ type: 'text' as const, value: 'resuelve a la tónica. Es la resolución más importante de la música tonal está a 1 s.t. de la tónica, por eso es la más tensa. El 7mo se llama "sensible tonal". ' }]),
        ...ctx('mayor'),
        { type: 'note', value: scale[6] }, { type: 'text', value: ' → ' }, { type: 'note', value: scale[0] },
        { type: 'text', value: '.' },
      ],
    },
  ];
}

const NOTE_DE_NAME: Record<string, string> = {
  C: 'C', 'C#': 'Cis', D: 'D', 'D#': 'Dis', E: 'E', F: 'F',
  'F#': 'Fis', G: 'G', 'G#': 'Gis', A: 'A', 'A#': 'B', B: 'H',
};
import styles from './TensionResolucionSection.module.css';

export default function TensionResolucionSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const tonic = useUIStore((s) => s.tonic);
  const reglas = useMemo(() => buildReglas(tonic, locale === 'de'), [tonic, locale]);

  return (
    <section id="s-tension" className={styles.section}>
      <SectionLabel text={t('t1.s05.label')} />
      <h2>{t('t1.s05.title')}</h2>

      <p className={styles.text}>{t('t1.s05.tension_title')}</p>

      <ol className={styles.reglas}>
        {reglas.map((r) => (
          <li key={r.titulo}>
            <span className={styles.reglaTitulo}>{r.titulo}</span> · <Prose segment={r.cuerpo} />
          </li>
        ))}
      </ol>

      <h3 className={styles.subheading}>{locale === 'de'
        ? `Karte der Auflösungen in ${NOTE_DE_NAME[tonicChromatic(tonic)] ?? tonic} Dur`
        : `Mapa de resoluciones en ${spelledNameES(tonic)} mayor`}</h3>
      <p className={styles.text}>{locale === 'de' ? TENSION_PRIMITIVA_INSTRUCCION_DE : TENSION_PRIMITIVA_INSTRUCCION}</p>
      <TensionResolucion />

      <RuleNote>{t('t1.s05.tip')}</RuleNote>
    </section>
  );
}
