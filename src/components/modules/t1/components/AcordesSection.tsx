import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import Prose from '../../../shared/Prose/Prose';
import AcordesBuilder from '../../../primitives/AcordesBuilder/AcordesBuilder';
import { useUIStore } from '../../../../stores/useUIStore';
import {
  chordSpelled,
  spelledChromaticCircle,
  spelledIntervalFromTonic,
} from '../../../../utils/noteCalculations';
import type { NoteSpelling, ChromaticNote } from '../../../../types/music';
import type { ProseSegment, ProseFragment } from '../../../../types/prose';
import styles from './AcordesSection.module.css';

// Reunión 24/5/26 — el ejemplo se reconstruye según la tónica activa, no se hardcodea.
// Construye los tres pasos del procedimiento (3 letras, semitonos hasta 3M, semitonos hasta 5J)
// usando el validador de enarmonía.

const ASCII = (s: string) => s.replace('♯', '#').replace('♭', 'b');

function buildPasoLetras(tonic: ChromaticNote, locale: string): ProseSegment {
  const [t1, t3, t5] = chordSpelled(tonic, 'M').map((m) => ASCII(m.spelled) as NoteSpelling);
  const prefix = locale === 'de' ? 'Buchstaben der Trias: ' : 'Letras de la tríada: ';
  return [
    { type: 'text', value: prefix },
    { type: 'note', value: t1 }, { type: 'text', value: ' ' },
    { type: 'note', value: t3 }, { type: 'text', value: ' ' },
    { type: 'note', value: t5 }, { type: 'text', value: '.' },
  ];
}

function buildPasoSemitonos(
  tonic: ChromaticNote,
  targetSemis: number,
  targetSpelled: string,
  letterRuleNote: string,
  locale: string,
): ProseSegment {
  const circle = spelledChromaticCircle(tonic);
  const tonicAscii = ASCII(circle[0].sharp) as NoteSpelling;
  const isTercera = targetSemis === 4;
  const prefix = locale === 'de'
    ? (isTercera ? 'Halbtöne bis zur gr. Terz: ' : 'Halbtöne bis zur r. Quinte: ')
    : (isTercera ? 'Semitonos hasta la 3M: ' : 'Semitonos hasta la 5J: ');

  const seg: ProseFragment[] = [
    { type: 'text', value: prefix },
    { type: 'note', value: tonicAscii },
  ];
  for (let i = 1; i <= targetSemis; i++) {
    const step = circle[i];
    seg.push({ type: 'text', value: ' → ' });
    const sharpAscii = ASCII(step.sharp) as NoteSpelling;
    if (step.flat) {
      const flatAscii = ASCII(step.flat) as NoteSpelling;
      seg.push({ type: 'note', value: sharpAscii }, { type: 'text', value: '/' }, { type: 'note', value: flatAscii });
    } else {
      seg.push({ type: 'note', value: sharpAscii });
    }
    seg.push({ type: 'text', value: ` (${i})` });
  }

  // Solo añadimos la caveat de la "regla del paso 1" en la 3M cuando hay ambigüedad enarmónica.
  const finalStep = circle[targetSemis];
  if (isTercera && finalStep.flat) {
    const correctAscii = ASCII(targetSpelled) as NoteSpelling;
    const altAscii = ASCII(
      correctAscii.length === 2 && correctAscii[1] === '#'
        ? (finalStep.flat as string)
        : (finalStep.sharp as string),
    ) as NoteSpelling;
    seg.push({ type: 'text', value: locale === 'de'
      ? '. Nach der Regel aus Schritt 1 ist der Buchstabe '
      : '. Por la regla del paso 1, la letra es ' });
    seg.push({ type: 'note', value: ASCII(letterRuleNote) as NoteSpelling });
    seg.push({ type: 'text', value: locale === 'de' ? ', also ist es ' : ', entonces es ' });
    seg.push({ type: 'note', value: correctAscii });
    seg.push({ type: 'text', value: locale === 'de' ? ' (nicht ' : ' (no ' });
    seg.push({ type: 'note', value: altAscii });
    seg.push({ type: 'text', value: ').' });
  } else {
    seg.push({ type: 'text', value: '.' });
  }
  return seg;
}

export default function AcordesSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const tonic = useUIStore((s) => s.tonic);
  const chordM = useMemo(() => chordSpelled(tonic, 'M'), [tonic]);
  const chordm = useMemo(() => chordSpelled(tonic, 'm'), [tonic]);

  const ejemploPasos = useMemo<ProseSegment[]>(() => {
    const tercera = spelledIntervalFromTonic(tonic, 3, 'M');
    const terceraLetter = tercera[0];
    return [
      buildPasoLetras(tonic, locale),
      buildPasoSemitonos(tonic, 4, tercera, terceraLetter, locale),
      buildPasoSemitonos(tonic, 7, spelledIntervalFromTonic(tonic, 5, 'P'), '', locale),
    ];
  }, [tonic, locale]);
  const procedure = t('t1.s07.procedure', { returnObjects: true }) as string[];

  return (
    <section id="s-acordes" className={styles.section}>
      <SectionLabel text={t('t1.s07.label')} />
      <h2>{t('t1.s07.title')}</h2>

      <p className={styles.text}>{t('t1.s07.intro')}</p>

      <ul className={styles.defList}>
        <li>{t('t1.s07.major_def')}</li>
        <li>{t('t1.s07.minor_def')}</li>
        <li>{t('t1.s07.diminished_def')}</li>
      </ul>

      <p className={styles.text}>{t('t1.s07.comparison')}</p>

      <h3 className={styles.subheading}>{t('t1.s07.notation_title')}</h3>
      <ul className={styles.nomList}>
        <li>{t('t1.s07.notation_major')}</li>
        <li>{t('t1.s07.notation_minor')}</li>
        <li>{t('t1.s07.notation_diminished')}</li>
      </ul>

      <h3 className={styles.subheading}>{t('t1.s07.procedure_title')}</h3>
      <ol className={styles.steps}>
        {procedure.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <h3 className={styles.subheading}>{chordM[0].spelled} {t('common.major')}</h3>
      <ol className={styles.steps}>
        {ejemploPasos.map((p, i) => (
          <li key={i}><Prose segment={p} /></li>
        ))}
      </ol>

      <p className={styles.resultado}>
        {chordM[0].spelled} {t('common.major')} = {chordM.map((m) => m.spelled).join('  ')}
      </p>
      <p className={styles.text}>
        {chordm[0].spelled} {t('common.minor')} = {chordm.map((m) => m.spelled).join('  ')}
      </p>

      <h3 className={styles.subheading}>{locale === 'de' ? 'Akkord-Konstruktor' : 'Constructor de acordes'}</h3>
      <p className={styles.text}>
        {locale === 'de' ? (
          <>Aktive Tonika: <strong>{tonic}</strong> · wähle eine Qualität (Dur, Moll oder vermindert), um den Akkord aufzubauen. Höre ihn als Block oder arpeggiert.</>
        ) : (
          <>Tónica activa: <strong>{tonic}</strong> · elegí una calidad (mayor, menor o disminuido) para construir el acorde. Escuchalo bloque o arpegiado.</>
        )}
      </p>
      <AcordesBuilder />
    </section>
  );
}
