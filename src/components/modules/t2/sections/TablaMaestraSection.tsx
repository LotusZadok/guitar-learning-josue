import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import {
  TABLA_MAESTRA_INTRO,
} from '../data/literalContent';
import { TONALIDADES } from '../data/tonalidades';
import ProcesoView from '../components/ProcesoView';
import styles from './TablaMaestraSection.module.css';

export default function TablaMaestraSection() {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const sostenidos = TONALIDADES.filter(t => t.tipo === 'sostenido');
  const bemoles = TONALIDADES.filter(t => t.tipo === 'bemol');
  const observations = t('t2.s45.observations', { returnObjects: true }) as string[];

  return (
    <section className={styles.section}>
      <SectionLabel text={t('t2.s45.label')} />
      <h2>{t('t2.s45.title')}</h2>

      {/* TODO i18n: sin clave — TABLA_MAESTRA_INTRO no tiene clave en de.json */}
      <p className={styles.intro}>{TABLA_MAESTRA_INTRO}</p>

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
              <span className={styles.colArm}>{ton.armadura.join(' ')}</span>
              <span className={styles.colTon}>{ton.tonica} {t('common.major')}</span>
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
              <span className={styles.colArm}>{ton.armadura.join(' ')}</span>
              <span className={styles.colTon}>{ton.tonica} {t('common.major')}</span>
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
