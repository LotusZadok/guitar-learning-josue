import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { NOTE_COLORS, NOTE_ES, NOTE_DE } from '../../../data/notes';

import { perfectFifth, noteShort } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './CirculoDeQuintas.module.css';

// Circle of fifths order (clockwise from C at 12 o'clock).
// D#/G#/A# appear in sharp spelling internally; labels show flat equivalents.
const COF_ORDER: ChromaticNote[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

// Reunión 24/5/26: en el círculo mostrar ambas enarmonías (#/b) en las 5 notas alteradas.
const ENHARMONIC_PAIRS: Partial<Record<ChromaticNote, { sharp: string; flat: string }>> = {
  'C#': { sharp: 'C♯', flat: 'D♭' },
  'D#': { sharp: 'D♯', flat: 'E♭' },
  'F#': { sharp: 'F♯', flat: 'G♭' },
  'G#': { sharp: 'G♯', flat: 'A♭' },
  'A#': { sharp: 'A♯', flat: 'B♭' },
};
// Single-line fallback for accessibility labels and the center display.
const noteLabel = (n: ChromaticNote) => {
  const pair = ENHARMONIC_PAIRS[n];
  return pair ? `${pair.sharp}/${pair.flat}` : noteShort(n);
};

// Excepciones a la regla 5J: B → F♯ (no F) y A♯(Bb) → F (no F♭). Marcadas con *.
const EXCEPTION_NOTES: ReadonlySet<ChromaticNote> = new Set<ChromaticNote>(['B', 'A#']);

const CX = 200, CY = 200, R = 140, NODE_R = 24;
// Reunión 6/7/26: mismo corte/separación que la lista de la regla 5ª (ReglaQuinta),
// para que la rueda del §1.8 y la lista suenen igual (principio de sonido).
const ARPEGGIO_GAP_MS = 400;
const NOTE_TAIL_MS = 380;

interface NodeData {
  note: ChromaticNote;
  x: number;
  y: number;
  angleDeg: number;
  fifthChromatic: ChromaticNote;
  fifthOctave: number;
  isException: boolean;
}

export default function CirculoDeQuintas() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const [hovered, setHovered] = useState<ChromaticNote | null>(null);
  const [playing, setPlaying] = useState(false);
  const { playSequence } = useAudioEngine();

  const nodes = useMemo<NodeData[]>(() =>
    COF_ORDER.map((note, i) => {
      const angleDeg = i * 30 - 90;
      const angleRad = angleDeg * Math.PI / 180;
      const fifth = perfectFifth(note);
      return {
        note,
        x: CX + R * Math.cos(angleRad),
        y: CY + R * Math.sin(angleRad),
        angleDeg,
        fifthChromatic: fifth.chromatic,
        fifthOctave: fifth.octave,
        isException: EXCEPTION_NOTES.has(note),
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
    // Tónica más grave → quinta ascendente, con corte (sin acumular voces).
    playSequence(
      [
        { name: node.note, octave: 4 },
        { name: node.fifthChromatic, octave: node.fifthOctave },
      ],
      ARPEGGIO_GAP_MS,
      NOTE_TAIL_MS,
    );
    setTimeout(() => setPlaying(false), ARPEGGIO_GAP_MS + NOTE_TAIL_MS + 300);
  }, [playing, playSequence]);

  const hoveredNode = hovered ? nodes.find((n) => n.note === hovered) : null;
  const fifthPos = hoveredNode ? fifthNodePos.get(hoveredNode.note) : null;

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox="0 0 400 400"
        role="img"
        aria-label={isDe
          ? 'Quintenzirkel: 12 Töne uhrenförmig angeordnet, jeder mit seiner reinen Quinte verbunden'
          : 'Círculo de quintas: 12 notas dispuestas en reloj, cada una conectada a su quinta justa'}
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
              aria-label={isDe
                ? `${NOTE_DE[node.note] ?? node.note}: reine Quinte → ${noteLabel(node.fifthChromatic)}${node.isException ? ' (Ausnahme)' : ''}`
                : `${NOTE_ES[node.note]}: quinta justa → ${noteLabel(node.fifthChromatic)}${node.isException ? ' (excepción)' : ''}`}
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
              {/* Reunión 24/5/26: monocromo salvo nodo activo y su 5J. */}
              <circle
                cx={node.x} cy={node.y}
                r={isHovered || isFifthOf ? NODE_R + 4 : NODE_R}
                fill={isHovered || isFifthOf ? NOTE_COLORS[node.note] : 'var(--surface)'}
                opacity={dim ? 0.25 : 1}
                stroke={isHovered ? 'var(--paper)' : isFifthOf ? 'var(--amber)' : 'var(--rule)'}
                strokeWidth={isHovered || isFifthOf ? 2 : 1}
              />
              {(() => {
                const pair = ENHARMONIC_PAIRS[node.note];
                const fillC = isHovered || isFifthOf ? '#fff' : 'var(--text-body)';
                if (pair) {
                  // Reunión 24/5/26: en alteradas mostrar ambas enarmonías apiladas.
                  return (
                    <>
                      <text
                        x={node.x} y={node.y - 4}
                        textAnchor="middle" dominantBaseline="middle"
                        className={styles.noteText}
                        fill={fillC}
                        opacity={dim ? 0.3 : 1}
                        fontSize={11}
                      >
                        {pair.sharp}
                      </text>
                      <text
                        x={node.x} y={node.y + 9}
                        textAnchor="middle" dominantBaseline="middle"
                        className={styles.noteText}
                        fill={fillC}
                        opacity={dim ? 0.3 : 1}
                        fontSize={11}
                      >
                        {pair.flat}
                      </text>
                    </>
                  );
                }
                return (
                  <text
                    x={node.x} y={node.y + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    className={styles.noteText}
                    fill={fillC}
                    opacity={dim ? 0.3 : 1}
                  >
                    {noteShort(node.note)}
                  </text>
                );
              })()}

              {/* Asterisco junto al lado del nodo que apunta a su 5J (entre B-F♯ y B♭-F). */}
              {node.isException && (() => {
                // Posición a +15° desde el nodo (la siguiente nota en sentido horario es la 5J).
                const midAngleRad = (node.angleDeg + 15) * Math.PI / 180;
                const badgeR = R + 16;
                const bx = CX + badgeR * Math.cos(midAngleRad);
                const by = CY + badgeR * Math.sin(midAngleRad);
                return (
                  <text
                    x={bx} y={by}
                    textAnchor="middle" dominantBaseline="middle"
                    className={styles.exceptionDot}
                    aria-hidden="true"
                  >
                    *
                  </text>
                );
              })()}
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
              {isDe ? '5r' : '5J'}
            </text>
            <text x={CX} y={CY + 12} textAnchor="middle" className={styles.centerSub}>
              {isDe ? 'tippen · klicken' : 'toca · clic'}
            </text>
          </>
        )}
      </svg>

      <p className={styles.footnote}>
        {isDe ? (
          <>* Ausnahmen: <strong>H → F♯</strong> (nicht F) und <strong>B♭ → F</strong> (nicht F♭). Dokumentiert in §1.8.</>
        ) : (
          <>* Excepciones: <strong>B → F♯</strong> (no F) y <strong>B♭ → F</strong> (no F♭). Documentadas en §1.8.</>
        )}
      </p>
    </div>
  );
}
