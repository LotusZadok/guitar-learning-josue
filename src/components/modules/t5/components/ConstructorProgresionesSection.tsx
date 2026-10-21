import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import CirculoTonalidades from '../../../primitives/CirculoTonalidades/CirculoTonalidades';
import BancoGrados from '../../../primitives/BancoGrados/BancoGrados';
import GrillaProgresion from '../../../primitives/GrillaProgresion/GrillaProgresion';
import TransporteProgresion, { MedidaProgresion } from '../../../primitives/TransporteProgresion/TransporteProgresion';
import { useProgressionPlayback } from '../../../../hooks/useProgressionPlayback';
import { useConstructorStore } from '../../../../stores/useConstructorStore';
import { armaduraPorId, etiquetaTonalidad } from '../../../../utils/progresionAcordes';
import { mismaTonalidad, type GradoId, type Modificador, type Tonalidad } from '../../../../utils/progresionArmonica';
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

  // Lo que se suelta puede ser un grado o una ficha modificadora ("mod:sus4", "mod:7").
  const soltar = (slotIndex: number, dato: string) => {
    if (dato.startsWith('mod:')) {
      s.armarModificador(dato.slice(4) as Modificador);
      s.modificarEn(slotIndex);
      return;
    }
    s.armarGrado(dato as GradoId);
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
        labels={{
          compas: t('t4.s41.compas_label'),
          compases: t('t4.s41.compases_label'),
          mundo: (mundo) => t(`t4.s41.mundo_${mundo}`),
        }}
      />

      <CirculoTonalidades
        armaduraId={s.armaduraId}
        modo={s.modo}
        onTonalidad={pedirTonalidad}
        labels={{
          grupo: t('t4.s41.tonalidad_label'),
          tonalidad: (tonica, modo) => t(`t4.s41.tonalidad_${modo}`, { tonica }),
        }}
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
        menorArmonicaLabel={t('t4.s41.menor_armonica')}
        expandirLabel={t('t4.s41.tonizaciones')}
        etiquetaArmar={(datos) => t('t4.s41.armar_grado', datos)}
        modificadores={{
          armado: s.modificadorArmado,
          onArmar: s.armarModificador,
          rotulo: t('t4.s41.modificadores'),
          etiqueta: (m) => t(`t4.s41.armar_${m === '7' ? 'septima' : m}`),
        }}
      />

      <GrillaProgresion
        grid={s.grid}
        compas={s.compas}
        nCompases={s.nCompases}
        sonando={sonando}
        hayGradoArmado={s.gradoArmado !== null}
        modificadorArmado={s.modificadorArmado}
        onModificar={s.modificarEn}
        etiquetaModificar={({ modificador, ...datos }) =>
          t('t4.s41.casilla_modificar', {
            ...datos,
            modificador: modificador === '7' ? t('t4.s41.la_septima') : modificador,
          })
        }
        onColocar={s.colocarEn}
        onVaciar={s.vaciarSlot}
        onSoltar={soltar}
        etiquetaModulacion={(tonalidad) => t('t4.s41.casilla_tonalidad', { tonalidad })}
        etiquetaCasilla={(accion, datos) =>
          t(`t4.s41.casilla_${accion === 'ninguna' ? 'vacia' : accion}`, datos)
        }
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
          metronomo: t('t4.s41.metronomo'),
          loop: t('t4.s41.loop'),
          velocidad: t('t4.s41.velocidad_label'),
          bpm: t('t4.s41.bpm_aria'),
          bpmValor: (bpm) => t('t4.s41.bpm_valuetext', { bpm }),
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
