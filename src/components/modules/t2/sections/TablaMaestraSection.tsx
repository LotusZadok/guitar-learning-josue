import { useState } from 'react';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import {
  TABLA_MAESTRA_INTRO,
  OBSERVACION_TONICAS_NATURALES,
  OBSERVACION_TONICAS_BEMOL,
  OBSERVACION_UTILIDAD,
} from '../data/literalContent';
import { TONALIDADES } from '../data/tonalidades';
import ProcesoView from '../components/ProcesoView';
import styles from './TablaMaestraSection.module.css';

export default function TablaMaestraSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const sostenidos = TONALIDADES.filter(t => t.tipo === 'sostenido');
  const bemoles = TONALIDADES.filter(t => t.tipo === 'bemol');

  return (
    <section className={styles.section}>
      <SectionLabel text="05 · Tabla maestra" />
      <h2>Todas las tonalidades mayores</h2>

      <p className={styles.intro}>{TABLA_MAESTRA_INTRO}</p>

      {/* Sharps table */}
      <h3 className={styles.subheading}>Tonalidades con #</h3>
      <div className={styles.table}>
        <div className={styles.header}>
          <span className={styles.colNum}>#</span>
          <span className={styles.colArm}>Armadura</span>
          <span className={styles.colTon}>Tonalidad</span>
        </div>
        {sostenidos.map(t => (
          <div key={t.id}>
            <div
              className={`${styles.row} ${expandedId === t.id ? styles.rowActive : ''}`}
              onClick={() => toggle(t.id)}
            >
              <span className={styles.colNum}>{t.numAlteraciones}</span>
              <span className={styles.colArm}>{t.armadura.join(' ')}</span>
              <span className={styles.colTon}>{t.tonica} mayor</span>
              <span className={styles.chevron}>{expandedId === t.id ? '▾' : '▸'}</span>
            </div>
            {expandedId === t.id && (
              <div className={styles.expanded}>
                <ProcesoView tonalidad={t} compact />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flats table */}
      <h3 className={styles.subheading}>Tonalidades con b</h3>
      <div className={styles.table}>
        <div className={styles.header}>
          <span className={styles.colNum}>b</span>
          <span className={styles.colArm}>Armadura</span>
          <span className={styles.colTon}>Tonalidad</span>
        </div>
        {bemoles.map(t => (
          <div key={t.id}>
            <div
              className={`${styles.row} ${expandedId === t.id ? styles.rowActive : ''}`}
              onClick={() => toggle(t.id)}
            >
              <span className={styles.colNum}>{t.numAlteraciones}</span>
              <span className={styles.colArm}>{t.armadura.join(' ')}</span>
              <span className={styles.colTon}>{t.tonica} mayor</span>
              <span className={styles.chevron}>{expandedId === t.id ? '▾' : '▸'}</span>
            </div>
            {expandedId === t.id && (
              <div className={styles.expanded}>
                <ProcesoView tonalidad={t} compact />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Observations */}
      <RuleNote>{OBSERVACION_TONICAS_NATURALES}</RuleNote>
      <RuleNote>{OBSERVACION_TONICAS_BEMOL}</RuleNote>
      <RuleNote>{OBSERVACION_UTILIDAD}</RuleNote>
    </section>
  );
}
