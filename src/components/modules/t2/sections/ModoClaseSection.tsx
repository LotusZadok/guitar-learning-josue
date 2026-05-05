import { useCallback, useState } from 'react';
import SectionLabel from '../../../shared/SectionLabel';
import ChromaticCircleAnimated from '../components/ChromaticCircleAnimated';
import { useAudioEngine } from '../../../../hooks/useAudioEngine';
import type { CircleNoteData } from '../data/processSteps';
import { NOTE_TO_POS } from '../data/processSteps';
import styles from './ModoClaseSection.module.css';

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const FREE_NOTES: CircleNoteData[] = CHROMATIC.map(label => ({
  label,
  state: 'natural',
}));

const SCALE_FORMULAS: Record<string, number[]> = {
  'Mayor':              [0, 2, 4, 5, 7, 9, 11],
  'Menor natural':      [0, 2, 3, 5, 7, 8, 10],
  'Menor armónica':     [0, 2, 3, 5, 7, 8, 11],
  'Pentatónica mayor':  [0, 2, 4, 7, 9],
  'Pentatónica menor':  [0, 3, 5, 7, 10],
};
const SCALE_NAMES = Object.keys(SCALE_FORMULAS);

function getScaleNotes(rootIndex: number, formula: number[]): string[] {
  return formula.map(semitones => CHROMATIC[(rootIndex + semitones) % 12]);
}

function sortAscendingFromTonic(notes: string[], tonicIdx: number): string[] {
  return [...notes].sort((a, b) => {
    const aOff = ((NOTE_TO_POS[a] - tonicIdx) + 12) % 12;
    const bOff = ((NOTE_TO_POS[b] - tonicIdx) + 12) % 12;
    return aOff - bOff;
  });
}

export default function ModoClaseSection() {
  const [tonic, setTonic] = useState<string>('C');
  const [scaleName, setScaleName] = useState<string>('Mayor');
  const [marked, setMarked] = useState<string[]>([]);
  const { playNote } = useAudioEngine();

  const loadScale = useCallback(() => {
    const rootIdx = NOTE_TO_POS[tonic];
    if (rootIdx === undefined) return;
    setMarked(getScaleNotes(rootIdx, SCALE_FORMULAS[scaleName]));
  }, [tonic, scaleName]);

  const playScale = useCallback(() => {
    if (marked.length === 0) return;
    const tonicIdx = NOTE_TO_POS[tonic] ?? 0;
    const ordered = sortAscendingFromTonic(marked, tonicIdx);
    let octave = 4;
    let prevPos = -1;
    ordered.forEach((note, i) => {
      const pos = NOTE_TO_POS[note];
      if (pos === undefined) return;
      if (i > 0 && pos <= prevPos) octave++;
      const oct = octave;
      setTimeout(() => playNote(note, oct, 1.2), i * 320);
      prevPos = pos;
    });
  }, [marked, tonic, playNote]);

  return (
    <section className={styles.section}>
      <SectionLabel text="06 — Modo clase" />

      <div className={styles.controls}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Tónica</span>
          <div className={styles.tonicGrid}>
            {CHROMATIC.map(n => (
              <button
                key={n}
                className={`${styles.chip} ${tonic === n ? styles.chipActive : ''}`}
                onClick={() => setTonic(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Escala</span>
          <div className={styles.scaleRow}>
            {SCALE_NAMES.map(s => (
              <button
                key={s}
                className={`${styles.chip} ${scaleName === s ? styles.chipActive : ''}`}
                onClick={() => setScaleName(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={loadScale}>
            Cargar escala
          </button>
          <button
            className={styles.actionBtn}
            onClick={playScale}
            disabled={marked.length === 0}
          >
            Tocar escala
          </button>
        </div>
      </div>

      <div className={styles.circleWrap}>
        <ChromaticCircleAnimated
          notes={FREE_NOTES}
          playOnClick
          inlineClearButton
          markedNotes={marked}
          onMarkedNotesChange={setMarked}
        />
      </div>
    </section>
  );
}
