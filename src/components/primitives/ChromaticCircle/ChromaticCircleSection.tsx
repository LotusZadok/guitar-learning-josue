import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ChromaticNode from './ChromaticNode';
import { ALL } from '../../../data/notes';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import type { ChromaticNote } from '../../../types/music';
import styles from './ChromaticCircle.module.css';

const CX = 200, CY = 200, R = 140;
const NOTE_DURATION = 1.4;

// Reunión 24/5/26: removido el toggle Arpegio/Bloque — el círculo cromático solo
// reproduce la nota individual al hover/click. La construcción de acordes vive en
// el constructor de acordes (§1.7), no acá.

export default function ChromaticCircleSection() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const { playNote } = useAudioEngine();

  const makePlayFn = useCallback(
    (note: ChromaticNote) => () => playNote(note, 4, NOTE_DURATION),
    [playNote],
  );

  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox="0 0 400 400">
        <circle cx={CX} cy={CY} r={R + 16} fill="none" style={{ stroke: 'var(--rule)' }} strokeWidth={0.5} />
        {(isDe ? ['Chromatischer', 'Kreis'] : ['Círculo', 'Cromático']).map((t, i) => (
          <text key={t} x={CX} y={CY - 8 + i * 18} textAnchor="middle" style={{ fill: 'var(--muted)' }} fontSize={11}>
            {t}
          </text>
        ))}
        {ALL.map((note, i) => (
          <ChromaticNode
            key={note}
            note={note}
            index={i}
            cx={CX} cy={CY} r={R}
            onPlay={makePlayFn(note)}
          />
        ))}
      </svg>
    </div>
  );
}
