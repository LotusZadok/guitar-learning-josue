import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import type { NoteSpelling } from '../../../../types/music';
import {
  TABLA_MAESTRA_INTRO,
  TABLA_MAESTRA_INTRO_DE,
} from '../data/literalContent';
import { TONALIDADES } from '../data/tonalidades';
import ProcesoView from '../components/ProcesoView';

function toGlyph(s: string): string {
  return s.replace(/([A-G])b/g, '$1♭').replace(/([A-G])#/g, '$1♯');
}

// Las 17 grafías que NoteToken sabe colorear/reproducir (12 sostenidos + 5
// bemoles canónicos). Cb/Fb/E♯/B♯ (tonalidades de 6-7 alteraciones) quedan
// como texto plano: son teóricamente correctas pero fuera del set que el
// motor de audio/color soporta (ver lessons-learned.md, "Spellings inválidos").
const VALID_NOTE_SPELLINGS = new Set([
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Db', 'Eb', 'Gb', 'Ab', 'Bb',
]);

function NoteOrText({ spelling }: { spelling: string }) {
  return VALID_NOTE_SPELLINGS.has(spelling)
    ? <NoteToken note={spelling as NoteSpelling} />
    : <span>{toGlyph(spelling)}</span>;
}

import styles from './TablaMaestraSection.module.css';

export default function TablaMaestraSection() {
  const { t, i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const sostenidos = TONALIDADES.filter(t => t.tipo === 'sostenido');
  const bemoles = TONALIDADES.filter(t => t.tipo === 'bemol');
  const observations = t('t2.s45.observations', { returnObjects: true }) as string[];

  return (
    <section id="s-t2-tabla" className={styles.section}>
      <SectionLabel text={t('t2.s45.label')} />
      <h2>{t('t2.s45.title')}</h2>

      <p className={styles.intro}>{isDe ? TABLA_MAESTRA_INTRO_DE : TABLA_MAESTRA_INTRO}</p>

      <h3 className={styles.subheading}>{t('t2.s45.sharps_section')}</h3>
      <div className={styles.table}>
        <div className={styles.header}>
          <span className={styles.colNum}>{t('t2.s45.table_headers.count')}</span>
          <span className={styles.colArm}>{t('t2.s45.table_headers.key_signature')}</span>
          <span className={styles.colTon}>{t('t2.s45.table_headers.tonality')}</span>
        </div>
        {sostenidos.map(ton => (
          <div key={ton.id}>
            <div
              className={`${styles.row} ${expandedId === ton.id ? styles.rowActive : ''}`}
              onClick={() => toggle(ton.id)}
            >
              <span className={styles.colNum}>{ton.numAlteraciones}</span>
              <span className={styles.colArm}>
                {ton.armadura.map((n, i) => (
                  <Fragment key={i}>
                    {i > 0 && ' '}
                    <NoteOrText spelling={n} />
                  </Fragment>
                ))}
              </span>
              <span className={styles.colTon}><NoteOrText spelling={ton.tonica} /> {t('common.major')}</span>
              <span className={styles.chevron}>{expandedId === ton.id ? '▾' : '▸'}</span>
            </div>
            {expandedId === ton.id && (
              <div className={styles.expanded}>
                <ProcesoView tonalidad={ton} compact />
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className={styles.subheading}>{t('t2.s45.flats_section')}</h3>
      <div className={styles.table}>
        <div className={styles.header}>
          <span className={styles.colNum}>{t('t2.s45.table_headers.count')}</span>
          <span className={styles.colArm}>{t('t2.s45.table_headers.key_signature')}</span>
          <span className={styles.colTon}>{t('t2.s45.table_headers.tonality')}</span>
        </div>
        {bemoles.map(ton => (
          <div key={ton.id}>
            <div
              className={`${styles.row} ${expandedId === ton.id ? styles.rowActive : ''}`}
              onClick={() => toggle(ton.id)}
            >
              <span className={styles.colNum}>{ton.numAlteraciones}</span>
              <span className={styles.colArm}>
                {ton.armadura.map((n, i) => (
                  <Fragment key={i}>
                    {i > 0 && ' '}
                    <NoteOrText spelling={n} />
                  </Fragment>
                ))}
              </span>
              <span className={styles.colTon}><NoteOrText spelling={ton.tonica} /> {t('common.major')}</span>
              <span className={styles.chevron}>{expandedId === ton.id ? '▾' : '▸'}</span>
            </div>
            {expandedId === ton.id && (
              <div className={styles.expanded}>
                <ProcesoView tonalidad={ton} compact />
              </div>
            )}
          </div>
        ))}
      </div>

      <RuleNote>
        <ul className={styles.observacionList}>
          {observations.map((obs, i) => (
            <li key={i}>{obs}</li>
          ))}
        </ul>
      </RuleNote>
    </section>
  );
}
