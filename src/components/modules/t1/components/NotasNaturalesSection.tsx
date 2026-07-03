import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import type { NoteSpelling } from '../../../../types/music';
import styles from './NotasNaturalesSection.module.css';

// Datos musicales (§1.1): pares solfeo ↔ cifrado anglosajón, no UI copy.
const NATURALES_TABLA_ES = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'] as const;
const NATURALES_TABLA_EN = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

// Reunión 24/5/26: tabla → círculo de 7 notas (refuerza la circularidad de la escala).
const CX = 140, CY = 140, R = 100;

function NaturalesCirculo() {
  return (
    <svg className={styles.circle} viewBox="0 0 280 280" role="img" aria-label="Las 7 notas naturales en círculo">
      <circle cx={CX} cy={CY} r={R + 14} fill="none" stroke="var(--rule)" strokeWidth={0.5} />
      {NATURALES_TABLA_EN.map((note, i) => {
        const angle = (i * (360 / 7) - 90) * Math.PI / 180;
        const x = CX + R * Math.cos(angle);
        const y = CY + R * Math.sin(angle);
        const labelX = CX + (R + 26) * Math.cos(angle);
        const labelY = CY + (R + 26) * Math.sin(angle);
        return (
          <g key={note}>
            <foreignObject x={x - 18} y={y - 14} width={36} height={28}>
              <div className={styles.circleNote}>
                <NoteToken note={note as NoteSpelling} />
              </div>
            </foreignObject>
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: 'var(--muted)' }}
              fontSize={10}
            >
              {NATURALES_TABLA_ES[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function NotasNaturalesSection() {
  const { t } = useTranslation();

  return (
    <section id="s-notas" className={styles.section}>
      <SectionLabel text={t('t1.s01.label')} />
      <h2>{t('t1.s01.title')}</h2>

      <p className={styles.text}>{t('t1.s01.intro')}</p>

      <NaturalesCirculo />

      <p className={styles.text}>{t('t1.s01.body')}</p>
      <p className={styles.text}>{t('t1.s01.rule')}</p>

      <RuleNote>{t('t1.s01.tip')}</RuleNote>
    </section>
  );
}
