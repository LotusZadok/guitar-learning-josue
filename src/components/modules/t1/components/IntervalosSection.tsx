import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import NoteSelector from '../../../shared/NoteSelector';
import Prose from '../../../shared/Prose/Prose';
import IntervalsSection from '../../../primitives/Intervals/IntervalsSection';
import { useUIStore } from '../../../../stores/useUIStore';
import { ALL } from '../../../../data/notes';
import { majorScaleSpelled } from '../../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../../types/music';
import type { ProseSegment } from '../../../../types/prose';
import {
  INTERVALOS_13_HEAD,
  INTERVALOS_13_ROW,
  INTERVALOS_PROCEDIMIENTO_PASOS,
  INTERVALOS_PROCEDIMIENTO_PASOS_DE,
} from '../data/literalContent';
import styles from './IntervalosSection.module.css';

// ── Dynamic interval-procedure builders ─────────────────────────────────────
// These replace the hardcoded G exports. Each function returns a ProseSegment
// (or a step array) derived from the active tonic.

const NATURAL_LETTERS_7 = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const SHARP_TO_FLAT_ASCII: Record<string, string> = {
  'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
};
// Letter offset for each of the 13 interval positions (0–12 semitones).
// Position 6 = tritone: rendered with both adjacent letters (handled separately).
const LETTER_OFFSETS_13 = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 0] as const;

function buildTitulo(tonicAscii: string, locale: string): ProseSegment {
  const text = locale === 'de'
    ? 'Verfahren zum Finden der Intervalle ausgehend von der Tonika '
    : 'Procedimiento para encontrar los intervalos partiendo de una tónica ';
  return [{ type: 'text', value: text }, { type: 'note', value: tonicAscii }];
}

function buildStep1(letterIdx: number, locale: string): ProseSegment {
  const prefix = locale === 'de'
    ? 'Die Buchstaben nach der Intervallnummer aufschreiben (Alterierungen ignorieren): '
    : 'Escribir las letras según el número del intervalo (ignorando alteraciones): ';
  const seg: ProseSegment = [{ type: 'text', value: prefix }];
  for (let i = 0; i <= 12; i++) {
    if (i === 6) {
      const l3 = NATURAL_LETTERS_7[(letterIdx + 3) % 7];
      const l4 = NATURAL_LETTERS_7[(letterIdx + 4) % 7];
      seg.push({ type: 'note', value: l3 }, { type: 'text', value: '-' }, { type: 'note', value: l4 });
    } else {
      const letter = NATURAL_LETTERS_7[(letterIdx + LETTER_OFFSETS_13[i]) % 7];
      seg.push({ type: 'note', value: letter });
    }
    seg.push({ type: 'text', value: i < 12 ? ' ' : '.' });
  }
  return seg;
}

function buildStep2(tonicIdx: number, locale: string): ProseSegment {
  const prefix = locale === 'de'
    ? 'Den chromatischen Kreis ab der Tonika aufschreiben: '
    : 'Escribir el círculo cromático desde la tónica: ';
  const seg: ProseSegment = [{ type: 'text', value: prefix }];
  for (let i = 0; i <= 12; i++) {
    const note = ALL[(tonicIdx + i) % 12];
    const flat = SHARP_TO_FLAT_ASCII[note];
    if (flat) {
      seg.push({ type: 'note', value: note }, { type: 'text', value: '/' }, { type: 'note', value: flat });
    } else {
      seg.push({ type: 'note', value: note });
    }
    seg.push({ type: 'text', value: i < 12 ? ' ' : '.' });
  }
  return seg;
}

function buildResultado(tonicIdx: number, letterIdx: number, tonicAscii: string, locale: string): ProseSegment {
  const prefix = locale === 'de' ? 'Ergebnis für ' : 'Resultado para ';
  const seg: ProseSegment = [
    { type: 'text', value: prefix },
    { type: 'note', value: tonicAscii },
    { type: 'text', value: ': ' },
  ];
  for (let i = 0; i <= 12; i++) {
    const note = ALL[(tonicIdx + i) % 12];
    const flat = SHARP_TO_FLAT_ASCII[note];
    if (flat && i === 6) {
      // Tritone: show both enharmonic forms.
      seg.push({ type: 'note', value: note }, { type: 'text', value: '/' }, { type: 'note', value: flat });
    } else if (flat) {
      // Pick the enharmonic whose first letter matches the expected letter.
      const expected = NATURAL_LETTERS_7[(letterIdx + LETTER_OFFSETS_13[i]) % 7];
      seg.push({ type: 'note', value: flat[0] === expected ? flat : note });
    } else {
      seg.push({ type: 'note', value: note });
    }
    seg.push({ type: 'text', value: i < 12 ? ' ' : '.' });
  }
  return seg;
}

function buildOctava(tonicAscii: string, locale: string): ProseSegment {
  if (locale === 'de') {
    return [
      { type: 'text', value: 'Die reine Oktave (8r) ist derselbe Ton eine Oktave höher oder tiefer. Die 8r von ' },
      { type: 'note', value: tonicAscii },
      { type: 'text', value: ' ist ' },
      { type: 'note', value: tonicAscii },
      { type: 'text', value: '.' },
    ];
  }
  return [
    { type: 'text', value: 'La 8J (octava justa) es la misma nota más aguda o más grave. La 8J de ' },
    { type: 'note', value: tonicAscii },
    { type: 'text', value: ' es ' },
    { type: 'note', value: tonicAscii },
    { type: 'text', value: '.' },
  ];
}

const GRADE_LABELS = ['T', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

function renderStep(step: string | ProseSegment) {
  return typeof step === 'string' ? step : <Prose segment={step} />;
}

export default function IntervalosSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const tonic = useUIStore((s) => s.tonic);
  const setTonic = useUIStore((s) => s.setTonic);
  const spelledScale = useMemo(() => majorScaleSpelled(tonic), [tonic]);

  // tonicAscii: ASCII form of spelled tonic (e.g. 'Bb' for A#, 'G' for G).
  const tonicAscii = useMemo(
    () => spelledScale[0].replace('♯', '#').replace('♭', 'b'),
    [spelledScale],
  );
  const tonicLetterIdx = useMemo(
    () => NATURAL_LETTERS_7.indexOf(tonicAscii[0] as typeof NATURAL_LETTERS_7[number]),
    [tonicAscii],
  );
  const tonicIdx = useMemo(() => ALL.indexOf(tonic), [tonic]);
  const staticPasos = locale === 'de' ? INTERVALOS_PROCEDIMIENTO_PASOS_DE : INTERVALOS_PROCEDIMIENTO_PASOS;

  const procedimientoTitulo = useMemo(
    () => buildTitulo(tonicAscii, locale),
    [tonicAscii, locale],
  );
  const procedimientoPasos = useMemo(
    () => [
      buildStep1(tonicLetterIdx, locale),
      buildStep2(tonicIdx, locale),
      staticPasos[2],   // letter-rule explanation (generic, keeps B/Bb example)
      staticPasos[3],   // "Actualizar la escala con los intervalos correctos."
    ],
    [tonicLetterIdx, tonicIdx, locale, staticPasos],
  );
  const resultadoG = useMemo(
    () => buildResultado(tonicIdx, tonicLetterIdx, tonicAscii, locale),
    [tonicIdx, tonicLetterIdx, tonicAscii, locale],
  );
  const octava = useMemo(
    () => buildOctava(tonicAscii, locale),
    [tonicAscii, locale],
  );

  return (
    <section id="s-intervalos" className={styles.section}>
      <SectionLabel text={t('t1.s04.label')} />
      <h2>{t('t1.s04.title')}</h2>

      <p className={styles.text}>{t('t1.s04.intro')}</p>

      <NoteSelector
        notes={[...ALL]}
        selected={tonic}
        onSelect={(n) => setTonic(n as ChromaticNote)}
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {GRADE_LABELS.map((g) => (
                <th key={g} scope="col">{g}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {spelledScale.map((n, i) => (
                <td key={i}>{n}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{t('t1.s04.quality_intro')}</p>

      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.tableIntervals}`}>
          <thead>
            <tr>
              {INTERVALOS_13_HEAD.map((h, i) => (
                <th key={i} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {INTERVALOS_13_ROW.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row">{c}</th>
                ) : (
                  <td key={i}>{c}</td>
                ),
              )}
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className={styles.subheading}><Prose segment={procedimientoTitulo} /></h3>
      <ol className={styles.steps}>
        {procedimientoPasos.map((p, i) => (
          <li key={i}>{renderStep(p)}</li>
        ))}
      </ol>

      <p className={styles.resultado}><Prose segment={resultadoG} /></p>
      <p className={styles.text}><Prose segment={octava} /></p>

      <IntervalsSection />
    </section>
  );
}
