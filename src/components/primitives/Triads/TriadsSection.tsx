import { useState } from 'react';
import SectionLabel from '../../shared/SectionLabel';
import TriadNode from './TriadNode';
import MasterTriad from './MasterTriad';
import { NATURALS, NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { TRIADS } from '../../../data/triads';
import type { NaturalNote } from '../../../types/music';
import styles from './Triads.module.css';

const CX = 175, CY = 175, R = 110;
const LABELS = ['Tónica', 'Tercera', 'Quinta'];

export default function TriadsSection() {
  const [activeTriad, setActiveTriad] = useState<NaturalNote | null>(null);
  const [triadLines, setTriadLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string }[]>([]);

  const handleHover = (note: NaturalNote | null) => {
    setActiveTriad(note);
    if (!note) {
      setTriadLines([]);
      return;
    }
    const triad = TRIADS[note];
    const angles = triad.notes.map((n) => {
      const ni = NATURALS.indexOf(n);
      const a = (ni * (360 / 7) - 90) * Math.PI / 180;
      return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
    });
    const lines = angles.map((a, i) => {
      const next = angles[(i + 1) % angles.length];
      return { x1: a.x, y1: a.y, x2: next.x, y2: next.y, color: NOTE_COLORS[note] };
    });
    setTriadLines(lines);
  };

  const displayNote = activeTriad ?? NATURALS[0];
  const triad = TRIADS[displayNote];

  return (
    <div className={styles.section}>
      <SectionLabel text="06 — Acordes" />
      <h2>Tríadas (Tónica · Tercera · Quinta)</h2>
      <p style={{ marginBottom: 20 }}>Pasa el mouse sobre las notas naturales para ver su tríada.</p>
      <div className={styles.circleWrap}>
        <svg className={styles.svg} viewBox="0 0 350 350">
          {['Notas', 'Naturales'].map((t, i) => (
            <text key={t} x={CX} y={CY - 6 + i * 16} textAnchor="middle" fill="#6b6560" fontSize={11}>
              {t}
            </text>
          ))}
          {triadLines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke={l.color} strokeWidth={2} opacity={0.5} strokeDasharray="4,3" />
          ))}
          {NATURALS.map((note, i) => (
            <TriadNode key={note} note={note} index={i} cx={CX} cy={CY} r={R}
              onHover={handleHover} />
          ))}
        </svg>
        <div
          className={styles.infoPanel}
          style={{
            borderColor: NOTE_COLORS[displayNote],
            visibility: activeTriad ? 'visible' : 'hidden',
          }}
        >
          <div className={styles.infoTitle} style={{ color: NOTE_COLORS[displayNote] }}>
            {NOTE_ES[displayNote]} · {displayNote}
          </div>
          <div className={styles.infoType}>{triad.type}</div>
          <div className={styles.infoNotes}>
            {triad.notes.map((n) => (
              <div key={n} className={styles.infoNote} style={{ background: NOTE_COLORS[n] }}>{n}</div>
            ))}
          </div>
          <div className={styles.infoLabels}>
            {triad.notes.map((n, j) => (
              <span key={n}>
                <span style={{ color: NOTE_COLORS[n], fontWeight: 600 }}>{n}</span> = {LABELS[j]}
                {j < 2 ? ' · ' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
      <MasterTriad />
    </div>
  );
}
