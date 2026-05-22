import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  'major':              [0, 2, 4, 5, 7, 9, 11],
  'minor_natural':      [0, 2, 3, 5, 7, 8, 10],
  'minor_harmonic':     [0, 2, 3, 5, 7, 8, 11],
  'pentatonic_major':   [0, 2, 4, 7, 9],
  'pentatonic_minor':   [0, 3, 5, 7, 10],
};
const SCALE_KEYS = Object.keys(SCALE_FORMULAS);
const SCALE_LABELS_ES: Record<string, string> = {
  major: 'Mayor',
  minor_natural: 'Menor natural',
  minor_harmonic: 'Menor armónica',
  pentatonic_major: 'Pentatónica mayor',
  pentatonic_minor: 'Pentatónica menor',
};
const SCALE_LABELS_DE: Record<string, string> = {
  major: 'Dur',
  minor_natural: 'Natürlich Moll',
  minor_harmonic: 'Harmonisch Moll',
  pentatonic_major: 'Pentatonisch Dur',
  pentatonic_minor: 'Pentatonisch Moll',
};

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
  const { t, i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const SCALE_LABELS = isDe ? SCALE_LABELS_DE : SCALE_LABELS_ES;
  const [tonic, setTonic] = useState<string>('C');
  const [scaleName, setScaleName] = useState<string>('major');
  const [marked, setMarked] = useState<string[]>([]);
  const [playingNote, setPlayingNote] = useState<string | null>(null);
  const isPlayingRef = useRef(false);
  const { playNote } = useAudioEngine();

  const loadScale = useCallback(() => {
    const rootIdx = NOTE_TO_POS[tonic];
    if (rootIdx === undefined) return;
    setMarked(getScaleNotes(rootIdx, SCALE_FORMULAS[scaleName]));
  }, [tonic, scaleName]);

  const playScale = useCallback(() => {
    if (isPlayingRef.current || marked.length === 0) return;
    isPlayingRef.current = true;
    const tonicIdx = NOTE_TO_POS[tonic] ?? 0;
    const ordered = sortAscendingFromTonic(marked, tonicIdx);
    let octave = 4;
    let prevPos = -1;
    ordered.forEach((note, i) => {
      const pos = NOTE_TO_POS[note];
      if (pos === undefined) return;
      if (i > 0 && pos <= prevPos) octave++;
      const oct = octave;
      setTimeout(() => {
        setPlayingNote(note);
        playNote(note, oct, 1.2);
      }, i * 320);
      prevPos = pos;
    });
    setTimeout(() => {
      setPlayingNote(null);
      isPlayingRef.current = false;
    }, (ordered.length - 1) * 320 + 1200);
  }, [marked, tonic, playNote]);

  return (
    <section id="s-t2-modo-clase" className={styles.section}>
      <SectionLabel text={t('t2.s46.label')} />

      <div className={styles.controls}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{t('common.tonic_selector_label')}</span>
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
          <span className={styles.rowLabel}>{t('common.scale_label')}</span>
          <div className={styles.scaleRow}>
            {SCALE_KEYS.map(s => (
              <button
                key={s}
                className={`${styles.chip} ${scaleName === s ? styles.chipActive : ''}`}
                onClick={() => setScaleName(s)}
              >
                {SCALE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={loadScale}>
            {isDe ? 'Tonleiter laden' : 'Cargar escala'}
          </button>
          <button
            className={styles.actionBtn}
            onClick={playScale}
            disabled={marked.length === 0 || playingNote !== null}
          >
            {isDe ? 'Tonleiter spielen' : 'Tocar escala'}
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
          playingNote={playingNote}
        />
      </div>
    </section>
  );
}
