import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import ArmaduraSelector from '../../../primitives/ArmaduraSelector/ArmaduraSelector';
import BancoGrados from '../../../primitives/BancoGrados/BancoGrados';
import GrillaProgresion from '../../../primitives/GrillaProgresion/GrillaProgresion';
import TransporteProgresion, { MedidaProgresion } from '../../../primitives/TransporteProgresion/TransporteProgresion';
import { useProgressionPlayback } from '../../../../hooks/useProgressionPlayback';
import { useConstructorStore } from '../../../../stores/useConstructorStore';
import { armaduraPorId, etiquetaTonalidad } from '../../../../utils/progresionAcordes';
import { mismaTonalidad, type GradoId, type Tonalidad } from '../../../../utils/progresionArmonica';
import styles from './ConstructorProgresionesSection.module.css';

// 4.1 · Constructor de progresiones. Sandbox puro: se arma y se oye. No evalúa,
// no puntúa, no guarda (PRODUCT.md). Esta sección solo compone: el estado vive
// en useConstructorStore y el reloj en useProgressionPlayback.
export default function ConstructorProgresionesSection() {
  const { t } = useTranslation();
  const s = useConstructorStore();
  const armadura = armaduraPorId(s.armaduraId);
  const [modulacionPendiente, setModulacionPendiente] = useState<Tonalidad | null>(null);
  const dialogoLimpiarRef = useRef<HTMLDialogElement>(null);
  const dialogoModularRef = useRef<HTMLDialogElement>(null);

  const { reproduciendo, pausado, sonando, play, pause } = useProgressionPlayback({
    grid: s.grid,
    compas: s.compas,
    bpm: s.bpm,
    septimas: s.septimas,
    metronomo: s.metronomo,
    loop: s.loop,
  });

  const hayContenido = s.grid.some((c) => c !== null);

  const aplicarTonalidad = ({ armaduraId, modo }: Tonalidad) => {
    s.setArmadura(armaduraId);
    s.setModo(modo);
  };

  // Reunión 19/10/26: "¿quién dijo que no se puede cambiar de tonalidad? Eso
  // se llama modulación". Con acordes ya puestos, cambiar de tonalidad
  // pregunta antes; lo puesto queda en su tonalidad y lo que sigue se coloca
  // en la nueva. Con la grilla vacía no hay nada que modular.
  const pedirTonalidad = (destino: Tonalidad) => {
    const actual = { armaduraId: s.armaduraId, modo: s.modo };
    if (mismaTonalidad(destino, actual)) return;
    if (!hayContenido) {
      aplicarTonalidad(destino);
      return;
    }
    setModulacionPendiente(destino);
    dialogoModularRef.current?.showModal();
  };

  // Limpiar no tiene deshacer ni persistencia: un click accidental borra el
  // trabajo. Solo se pregunta si hay algo que perder. Reunión 19/10/26: la
  // pregunta va en una ventana encima de todo (el profesor no la vio y borró
  // igual). `showModal()` trae foco, Esc y fondo bloqueado nativos.
  const pedirLimpiar = () => {
    if (!hayContenido) return;
    dialogoLimpiarRef.current?.showModal();
  };

  const soltar = (slotIndex: number, id: GradoId) => {
    s.armarGrado(id);
    s.colocarEn(slotIndex);
  };

  return (
    <section id="s-t4-constructor" className={styles.section}>
      <SectionLabel text={t('t4.s41.label')} />
      <h2>{t('t4.s41.title')}</h2>

      <p className={styles.text}>{t('t4.s41.intro')}</p>

      <MedidaProgresion
        compas={s.compas}
        nCompases={s.nCompases}
        onCompas={s.setCompas}
        onNCompases={s.setNCompases}
      />

      <ArmaduraSelector
        armaduraId={s.armaduraId}
        modo={s.modo}
        onArmadura={(armaduraId) => pedirTonalidad({ armaduraId, modo: s.modo })}
        onModo={(modo) => pedirTonalidad({ armaduraId: s.armaduraId, modo })}
        septimas={{ activas: s.septimas, etiqueta: t('t4.s41.septimas'), onToggle: s.toggleSeptimas }}
      />

      <dialog
        ref={dialogoModularRef}
        className={styles.dialogo}
        aria-labelledby="aviso-modular"
        onClose={() => setModulacionPendiente(null)}
      >
        <p id="aviso-modular" className={styles.text}>
          {modulacionPendiente &&
            t('t4.s41.aviso_modular', {
              tonalidad: etiquetaTonalidad(armaduraPorId(modulacionPendiente.armaduraId), modulacionPendiente.modo),
              actual: etiquetaTonalidad(armadura, s.modo),
            })}
        </p>
        <form method="dialog" className={styles.avisoAcciones}>
          <button
            type="submit"
            value="modular"
            onClick={() => modulacionPendiente && aplicarTonalidad(modulacionPendiente)}
          >
            {t('t4.s41.aviso_modular_si')}
          </button>
          <button type="submit" value="cancelar">
            {t('t4.s41.aviso_cancelar')}
          </button>
        </form>
      </dialog>

      <BancoGrados
        armadura={armadura}
        modo={s.modo}
        septimas={s.septimas}
        gradoArmado={s.gradoArmado}
        onArmar={s.armarGrado}
        tonizacionesLabel={t('t4.s41.tonizaciones_rotulo')}
      />

      <GrillaProgresion
        grid={s.grid}
        compas={s.compas}
        nCompases={s.nCompases}
        septimas={s.septimas}
        sonando={sonando}
        hayGradoArmado={s.gradoArmado !== null}
        onColocar={s.colocarEn}
        onVaciar={s.vaciarSlot}
        onSoltar={soltar}
        etiquetaModulacion={(tonalidad) => t('t4.s41.casilla_tonalidad', { tonalidad })}
      />

      <TransporteProgresion
        bpm={s.bpm}
        metronomo={s.metronomo}
        loop={s.loop}
        reproduciendo={reproduciendo}
        onBpm={s.setBpm}
        onMetronomo={s.toggleMetronomo}
        onLoop={s.toggleLoop}
        onPlay={play}
        onPausa={pause}
        onLimpiar={pedirLimpiar}
        labels={{
          reproducir: t(pausado ? 't4.s41.reanudar' : 't4.s41.reproducir'),
          pausar: t('t4.s41.pausar'),
          limpiar: t('t4.s41.limpiar'),
        }}
      />

      <dialog ref={dialogoLimpiarRef} className={styles.dialogo} aria-labelledby="aviso-limpiar">
        <p id="aviso-limpiar" className={styles.text}>{t('t4.s41.aviso_limpiar')}</p>
        <form method="dialog" className={styles.avisoAcciones}>
          <button type="submit" value="borrar" onClick={() => s.limpiarGrid()}>
            {t('t4.s41.aviso_limpiar_si')}
          </button>
          <button type="submit" value="cancelar">
            {t('t4.s41.aviso_cancelar')}
          </button>
        </form>
      </dialog>

      <p className={styles.text}>{t('t4.s41.explain')}</p>
    </section>
  );
}
