import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import NoteSelector from '../../../shared/NoteSelector';
import { TONALIDADES_BEMOLES } from '../data/tonalidades';
import ProcesoView from '../components/ProcesoView';
import styles from './ProcesoSection.module.css';

const NOTAS = TONALIDADES_BEMOLES.map(t => t.id);

export default function ProcesoBemolesSection() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('Eb');
  const tonalidad = TONALIDADES_BEMOLES.find(t => t.id === selected)!;

  return (
    <section className={styles.section}>
      <SectionLabel text={t('t2.s43.label')} />
      <h2 className={`${styles.titulo} ${styles.tituloMono}`}>{t('t2.s43.title')}</h2>

      <NoteSelector notes={NOTAS} selected={selected} onSelect={setSelected} />

      <ProcesoView tonalidad={tonalidad} />
    </section>
  );
}
