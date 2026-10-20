import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import ArmaduraSelector from '../../../primitives/ArmaduraSelector/ArmaduraSelector';
import BancoGrados from '../../../primitives/BancoGrados/BancoGrados';
import GrillaProgresion from '../../../primitives/GrillaProgresion/GrillaProgresion';
import TransporteProgresion, { MedidaProgresion } from '../../../primitives/TransporteProgresion/TransporteProgresion';
import { useProgressionPlayback } from '../../../../hooks/useProgressionPlayback';
import { contarHuerfanas, useConstructorStore } from '../../../../stores/useConstructorStore';
import { armaduraPorId } from '../../../../utils/progresionAcordes';
import type { GradoId, Modo } from '../../../../utils/progresionArmonica';
import styles from './ConstructorProgresionesSection.module.css';

// 4.1 · Constructor de progresiones. Sandbox puro: se arma y se oye. No evalúa,
// no puntúa, no guarda (PRODUCT.md). Esta sección solo compone: el estado vive
// en useConstructorStore y el reloj en useProgressionPlayback.
export default function ConstructorProgresionesSection() {
  const { t } = useTranslation();
  const s = useConstructorStore();
  const armadura = armaduraPorId(s.armaduraId);
  const [modoPendiente, setModoPendiente] = useState<Modo | null>(null);
  const [confirmarLimpiar, setConfirmarLimpiar] = useState(false);

  const { reproduciendo, pausado, sonando, play, pause } = useProgressionPlayback({
    grid: s.grid,
    compas: s.compas,
    bpm: s.bpm,
    armadura,
    modo: s.modo,
    septimas: s.septimas,
    metronomo: s.metronomo,
    loop: s.loop,
  });

  const hayContenido = s.grid.some((c) => c !== null);

  // Cambiar de modo reescribe los romanos, así que las casillas cuyo grado no
  // existe en el modo destino se vacían. Se avisa ANTES, no se deshace después.
  const pedirModo = (modo: Modo) => {
    if (modo === s.modo) return;
    const huerfanas = contarHuerfanas(s.grid, modo);
    if (huerfanas === 0) {
      s.setModo(modo);
      return;
    }
    // Solo un aviso a la vez: si "limpiar" ya estaba pidiendo confirmación,
    // esta acción lo reemplaza en vez de apilarse encima.
    setConfirmarLimpiar(false);
    setModoPendiente(modo);
  };

  // Limpiar no tiene deshacer ni persistencia: un click accidental borra el
  // trabajo. Solo se pregunta si hay algo que perder.
  const pedirLimpiar = () => {
    if (!hayContenido) return;
    setModoPendiente(null);
    setConfirmarLimpiar(true);
  };

  const soltar = (slotIndex: number, id: GradoId) => {
    s.armarGrado(id);
    s.colocarEn(slotIndex);
  };

  // Un alertdialog que no recibe foco es invisible para un lector de
  // pantalla: al aparecer, el foco se mueve a su primera acción.
  const primeraAccionModoRef = useRef<HTMLButtonElement>(null);
  const primeraAccionLimpiarRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modoPendiente) primeraAccionModoRef.current?.focus();
  }, [modoPendiente]);
  useEffect(() => {
    if (confirmarLimpiar) primeraAccionLimpiarRef.current?.focus();
  }, [confirmarLimpiar]);

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
        onArmadura={s.setArmadura}
        onModo={pedirModo}
        septimas={{ activas: s.septimas, etiqueta: t('t4.s41.septimas'), onToggle: s.toggleSeptimas }}
      />

      {modoPendiente && (
        <div className={styles.aviso} role="alertdialog" aria-labelledby="aviso-modo">
          <p id="aviso-modo" className={styles.text}>
            {t('t4.s41.aviso_modo', { count: contarHuerfanas(s.grid, modoPendiente) })}
          </p>
          <div className={styles.avisoAcciones}>
            <button
              ref={primeraAccionModoRef}
              type="button"
              onClick={() => { s.setModo(modoPendiente); setModoPendiente(null); }}
            >
              {t('t4.s41.aviso_continuar')}
            </button>
            <button type="button" onClick={() => setModoPendiente(null)}>
              {t('t4.s41.aviso_cancelar')}
            </button>
          </div>
        </div>
      )}

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
        armadura={armadura}
        modo={s.modo}
        septimas={s.septimas}
        sonando={sonando}
        hayGradoArmado={s.gradoArmado !== null}
        onColocar={s.colocarEn}
        onVaciar={s.vaciarSlot}
        onSoltar={soltar}
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

      {confirmarLimpiar && (
        <div className={styles.aviso} role="alertdialog" aria-labelledby="aviso-limpiar">
          <p id="aviso-limpiar" className={styles.text}>{t('t4.s41.aviso_limpiar')}</p>
          <div className={styles.avisoAcciones}>
            <button
              ref={primeraAccionLimpiarRef}
              type="button"
              onClick={() => { s.limpiarGrid(); setConfirmarLimpiar(false); }}
            >
              {t('t4.s41.aviso_limpiar_si')}
            </button>
            <button type="button" onClick={() => setConfirmarLimpiar(false)}>
              {t('t4.s41.aviso_cancelar')}
            </button>
          </div>
        </div>
      )}

      <p className={styles.text}>{t('t4.s41.explain')}</p>
    </section>
  );
}
