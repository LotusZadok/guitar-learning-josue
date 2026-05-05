import { useState } from 'react';
import SectionLabel from '../../../shared/SectionLabel';
import NoteSelector from '../../../shared/NoteSelector';
import { TITULO_BEMOLES } from '../data/literalContent';
import { TONALIDADES_BEMOLES } from '../data/tonalidades';
import ProcesoView from '../components/ProcesoView';
import styles from './ProcesoSection.module.css';

const NOTAS = TONALIDADES_BEMOLES.map(t => t.id);

export default function ProcesoBemolesSection() {
  const [selected, setSelected] = useState('Eb');
  const tonalidad = TONALIDADES_BEMOLES.find(t => t.id === selected)!;

  return (
    <section className={styles.section}>
      <SectionLabel text="04 · Proceso con bemoles" />
      <h2 className={styles.titulo}>{TITULO_BEMOLES}</h2>

      <NoteSelector notes={NOTAS} selected={selected} onSelect={setSelected} />

      <ProcesoView tonalidad={tonalidad} />
    </section>
  );
}
