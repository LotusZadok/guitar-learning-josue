import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import NoteSelector from '../../../shared/NoteSelector';
import { TONALIDADES_SOSTENIDOS } from '../data/tonalidades';
import ProcesoView from '../components/ProcesoView';
import styles from './ProcesoSection.module.css';

const NOTAS = TONALIDADES_SOSTENIDOS.map(t => t.id);

export default function ProcesoSostenidosSection() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('E');
  const tonalidad = TONALIDADES_SOSTENIDOS.find(t => t.id === selected)!;

  return (
    <section id="s-t2-sostenidos" className={styles.section}>
      <SectionLabel text={t('t2.s42.label')} />
      <h2 className={styles.titulo}>{t('t2.s42.title')}</h2>

      <NoteSelector notes={NOTAS} selected={selected} onSelect={setSelected} />

      <ProcesoView tonalidad={tonalidad} />
    </section>
  );
}
