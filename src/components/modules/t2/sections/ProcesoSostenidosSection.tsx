import { useState } from 'react';
import SectionLabel from '../../../shared/SectionLabel';
import NoteSelector from '../../../shared/NoteSelector';
import { TITULO_SOSTENIDOS } from '../data/literalContent';
import { TONALIDADES_SOSTENIDOS } from '../data/tonalidades';
import ProcesoView from '../components/ProcesoView';
import styles from './ProcesoSection.module.css';

const NOTAS = TONALIDADES_SOSTENIDOS.map(t => t.id);

export default function ProcesoSostenidosSection() {
  const [selected, setSelected] = useState('E');
  const tonalidad = TONALIDADES_SOSTENIDOS.find(t => t.id === selected)!;

  return (
    <section className={styles.section}>
      <SectionLabel text="03 · Proceso con sostenidos" />
      <h2 className={styles.titulo}>{TITULO_SOSTENIDOS}</h2>

      <NoteSelector notes={NOTAS} selected={selected} onSelect={setSelected} />

      <ProcesoView tonalidad={tonalidad} />
    </section>
  );
}
