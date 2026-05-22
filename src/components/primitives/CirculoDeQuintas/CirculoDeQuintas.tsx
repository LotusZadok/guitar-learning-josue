import { useCallback, useMemo, useState } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { perfectFifth, noteShort } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './CirculoDeQuintas.module.css';

// Circle of fifths order (clockwise from C at 12 o'clock).
// D#/G#/A# appear in sharp spelling internally; labels show flat equivalents.
const COF_ORDER: ChromaticNote[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

const FLAT_LABELS: Partial<Record<ChromaticNote, string>> = {
  'D#': 'E♭', 'G#': 'A♭', 'A#': 'B♭',
};
const noteLabel = (n: ChromaticNote) => FLAT_LABELS[n] ?? noteShort(n);

// B → F# is the documented exception (the rule says "natural copies natural", but B → F#).
const EXCEPTION_NOTE: ChromaticNote = 'B';

const CX = 200, CY = 200, R = 140, NODE_R = 24;
const ARPEGGIO_GAP_MS = 280;
const NOTE_DURATION = 1.6;

interface NodeData {
  note: ChromaticNote;
  x: number;
  y: number;
  fifthChromatic: ChromaticNote;
  fifthOctave: number;
  isException: boolean;
}

export default function CirculoDeQuintas() {
  const [hovered, setHovered] = useState<ChromaticNote | null>(null);
  const [playing, setPlaying] = useState(false);
  const { playNote } = useAudioEngine();

  const nodes = useMemo<NodeData[]>(() =>
    COF_ORDER.map((note, i) => {
      const angleDeg = i * 30 - 90;
      const angleRad = angleDeg * Math.PI / 180;
      const fifth = perfectFifth(note);
      return {
        note,
        x: CX + R * Math.cos(angleRad),
        y: CY + R * Math.sin(angleRad),
        fifthChromatic: fifth.chromatic,
        fifthOctave: fifth.octave,
        isException: note === EXCEPTION_NOTE,
      };
    }),
  []);

  // Index of the fifth for each node (next clockwise in COF).
  const fifthNodePos = useMemo<Map<ChromaticNote, { x: number; y: number }>>(() => {
    const map = new Map<ChromaticNote, { x: number; y: number }>();
    nodes.forEach((node) => {
      const target = nodes.find((n) => n.note === node.fifthChromatic);
      if (target) map.set(node.note, { x: target.x, y: target.y });
    });
    return map;
  }, [nodes]);

  const handlePlay = useCallback((node: NodeData) => {
    if (playing) return;
    setPlaying(true);
    playNote(node.note, 4, NOTE_DURATION);
    setTimeout(() => {
      playNote(node.fifthChromatic, node.fifthOctave, NOTE_DURATION);
      setTimeout(() => setPlaying(false), NOTE_DURATION * 1000);
    }, ARPEGGIO_GAP_MS);
  }, [playing, playNote]);

  const hoveredNode = hovered ? nodes.find((n) => n.note === hovered) : null;
  const fifthPos = hoveredNode ? fifthNodePos.get(hoveredNode.note) : null;

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox="0 0 400 400"
        role="img"
        aria-label="Círculo de quintas: 12 notas dispuestas en reloj, cada una conectada a su quinta justa"
      >
        {/* Connection line from hovered note to its fifth */}
        {hoveredNode && fifthPos && (
          <line
            x1={hoveredNode.x} y1={hoveredNode.y}
            x2={fifthPos.x} y2={fifthPos.y}
            stroke={NOTE_COLORS[hoveredNode.note]}
            strokeWidth={2}
            strokeDasharray="5,3"
            opacity={0.6}
          />
        )}

        {/* Nodes */}
        {nodes.map((node) => {
          const isHovered = hovered === node.note;
          const isFifthOf = hoveredNode?.fifthChromatic === node.note;
          const dim = hovered && !isHovered && !isFifthOf;

          return (
            <g
              key={node.note}
              className={styles.node}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              tabIndex={0}
              role="button"
              aria-label={`${NOTE_ES[node.note]}: quinta justa → ${noteLabel(node.fifthChromatic)}${node.isException ? ' (excepción)' : ''}`}
              onMouseEnter={() => setHovered(node.note)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(node.note)}
              onBlur={() => setHovered(null)}
              onTouchStart={(e) => { e.preventDefault(); setHovered(node.note); handlePlay(node); }}
              onTouchEnd={() => setTimeout(() => setHovered(null), 600)}
              onClick={() => handlePlay(node)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePlay(node);
                }
              }}
            >
              <circle
                cx={node.x} cy={node.y}
                r={isHovered || isFifthOf ? NODE_R + 4 : NODE_R}
                fill={NOTE_COLORS[node.note]}
                opacity={dim ? 0.25 : 1}
                stroke={isHovered ? 'var(--paper)' : isFifthOf ? 'var(--amber)' : 'none'}
                strokeWidth={isHovered || isFifthOf ? 2 : 0}
              />
              <text
                x={node.x} y={node.y + 1}
                textAnchor="middle" dominantBaseline="middle"
                className={styles.noteText}
                opacity={dim ? 0.3 : 1}
              >
                {noteLabel(node.note)}
              </text>

              {/* Exception badge on B */}
              {node.isException && (
                <text
                  x={node.x + NODE_R - 2}
                  y={node.y - NODE_R + 2}
                  className={styles.exceptionDot}
                  aria-hidden="true"
                >
                  *
                </text>
              )}
            </g>
          );
        })}

        {/* Center label */}
        {hoveredNode ? (
          <>
            <text x={CX} y={CY - 14} textAnchor="middle" className={styles.centerNote}>
              {noteLabel(hoveredNode.note)}
            </text>
            <text x={CX} y={CY + 4} textAnchor="middle" className={styles.centerArrow}>
              →
            </text>
            <text x={CX} y={CY + 22} textAnchor="middle" className={styles.centerNote}
              fill={NOTE_COLORS[hoveredNode.fifthChromatic]}>
              {noteLabel(hoveredNode.fifthChromatic)}
            </text>
          </>
        ) : (
          <>
            <text x={CX} y={CY - 6} textAnchor="middle" className={styles.centerLabel}>
              5J
            </text>
            <text x={CX} y={CY + 12} textAnchor="middle" className={styles.centerSub}>
              toca · clic
            </text>
          </>
        )}
      </svg>

      <p className={styles.footnote}>
        * La quinta de <strong>B</strong> es <strong>F♯</strong> (no F natural): excepción documentada en §1.8.
      </p>
    </div>
  );
}
